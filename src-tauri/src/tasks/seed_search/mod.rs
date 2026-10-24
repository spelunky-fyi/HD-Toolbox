//! The Seed Search tab. Generates levels for random seeds with hd-seed-search,
//! which runs the game's own level generation in a hidden Spelunky.exe
//! (https://github.com/spelunky-fyi/hd-seed-search), and checks them for
//! SpecsHD's seed search presets.
//! Every seed checked is added to a csv in SpecsHD's seed_search.csv format,
//! with extra columns for prize wheel prizes.

mod entity_names;
pub mod presets;
mod steam;

use std::collections::HashMap;
use std::fs::{self, File, OpenOptions};
use std::io::{BufRead, BufReader, BufWriter, ErrorKind, Read, Seek, SeekFrom, Write};
use std::path::{Path, PathBuf};
use std::process::Stdio;
use std::time::{Duration, SystemTime, UNIX_EPOCH};

use anyhow::{bail, Context};
use log::{debug, error};
use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Manager};
use tokio::io::AsyncReadExt;
use tokio::process::Command;
use tokio::select;
use tokio::sync::oneshot;
use tokio::time::{interval, Instant, MissedTickBehavior};

use presets::{display, evaluate, prize, GeneratedSeed, Levels, Preset, ALL, PRIZE_WHEEL_SHOPS};

use super::TaskUpdate;

static TASK_STATE_SEED_SEARCH: &str = "task-state:SeedSearch";

const SEED_SEARCH_RESOURCE: &str = "resources/seed-search/hd-seed-search.exe";
const CREATE_NO_WINDOW: u32 = 0x0800_0000;

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct SeedSearchOptions {
    pub seed_count: u32,
    /// Empty for the Toolbox's own file
    pub output_csv: String,
}

const DEFAULT_CSV: &str = "seed_search.csv";

/// The results csv to use, which is the Toolbox's own unless the user picked
/// one
fn results_csv(app_handle: &AppHandle, custom: &str) -> anyhow::Result<PathBuf> {
    if !custom.is_empty() {
        return Ok(PathBuf::from(custom));
    }
    let dir = app_handle
        .path_resolver()
        .app_data_dir()
        .context("Couldn't find the Toolbox's data folder")?;
    fs::create_dir_all(&dir)?;
    Ok(dir.join(DEFAULT_CSV))
}

#[derive(Serialize, Clone, Copy, Debug, PartialEq, Eq)]
pub enum SearchState {
    Starting,
    Running,
    Finished,
    Stopped,
}

/// A checked seed and its value for each preset
#[derive(Serialize, Clone, Debug)]
pub struct SeedResult {
    pub seed: u32,
    pub values: HashMap<Preset, String>,
    /// How the Toolbox shows each value, see presets::display
    pub display: HashMap<Preset, String>,
}

#[derive(Serialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Progress {
    pub state: SearchState,
    pub checked: u32,
    pub total: u32,
    pub seeds_per_second: f64,
    pub hits: HashMap<Preset, u32>,
    /// Seeds checked since the last update
    pub new_results: Vec<SeedResult>,
}

#[derive(Serialize, Clone, Debug)]
#[serde(tag = "type", content = "data")]
pub enum SeedSearchUpdate {
    SeedSearch(Progress),
    Failure(String),
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PresetInfo {
    id: Preset,
    name: &'static str,
    label: &'static str,
    matchable: bool,
}

#[tauri::command]
pub fn seed_search_presets() -> Vec<PresetInfo> {
    ALL.iter()
        .map(|&preset| PresetInfo {
            id: preset,
            name: preset.name(),
            label: preset.label(),
            matchable: preset.matchable(),
        })
        .collect()
}

/// The seeds already in a seed_search.csv, which can be SpecsHD's. Columns
/// are found by name and rows that don't parse are skipped.
/// An empty path is the Toolbox's own file.
#[tauri::command]
pub fn load_seed_search_results(
    app_handle: AppHandle,
    path: String,
) -> Result<Vec<SeedResult>, String> {
    let path = results_csv(&app_handle, &path).map_err(|err| format!("{:#}", err))?;
    load_results(&path)
}

/// Where the Toolbox keeps its results csv, for showing the user
#[tauri::command]
pub fn default_seed_search_csv(app_handle: AppHandle) -> Result<String, String> {
    results_csv(&app_handle, "")
        .map(|path| path.to_string_lossy().into_owned())
        .map_err(|err| format!("{:#}", err))
}

fn load_results(path: &Path) -> Result<Vec<SeedResult>, String> {
    let contents = match fs::read_to_string(path) {
        Ok(contents) => contents,
        Err(err) if err.kind() == ErrorKind::NotFound => return Ok(vec![]),
        Err(err) => return Err(format!("Couldn't read {}: {}", path.display(), err)),
    };
    let mut lines = contents.lines();
    let Some(header) = lines.next() else {
        return Ok(vec![]);
    };
    let columns: Vec<_> = header.trim_end().split(',').skip(1).map(Column::named).collect();

    Ok(lines
        .filter_map(|line| {
            let mut cells = line.trim_end().split(',');
            let seed = cells.next()?.parse().ok()?;
            let mut values = HashMap::new();
            let mut prizes = HashMap::new();
            for (column, cell) in columns.iter().zip(cells) {
                if cell.is_empty() {
                    continue;
                }
                match column {
                    Column::Preset(preset) => values.insert(*preset, cell.to_string()),
                    Column::Prize(preset) => prizes.insert(*preset, cell.to_string()),
                    Column::Other => None,
                };
            }
            Some(SeedResult {
                seed,
                display: displayed(&values, &prizes),
                values,
            })
        })
        .collect())
}

fn displayed(
    values: &HashMap<Preset, String>,
    prizes: &HashMap<Preset, String>,
) -> HashMap<Preset, String> {
    values
        .iter()
        .map(|(&preset, value)| {
            (preset, display(value, prizes.get(&preset).map(String::as_str)))
        })
        .collect()
}

fn emit(app_handle: &AppHandle, update: SeedSearchUpdate) {
    if let Err(err) = app_handle.emit_all(TASK_STATE_SEED_SEARCH, TaskUpdate::SeedSearch(update))
    {
        error!("Failed to notify window: {:?}", err);
    }
}

/// splitmix64, seeded from the clock
fn random_seeds(count: u32) -> Vec<u32> {
    let mut state = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|time| time.as_nanos() as u64)
        .unwrap_or(0);
    (0..count)
        .map(|_| {
            state = state.wrapping_add(0x9e37_79b9_7f4a_7c15);
            let mut z = state;
            z = (z ^ (z >> 30)).wrapping_mul(0xbf58_476d_1ce4_e5b9);
            z = (z ^ (z >> 27)).wrapping_mul(0x94d0_49bb_1331_11eb);
            ((z ^ (z >> 31)) >> 32) as u32
        })
        .collect()
}

/// A column of a seed_search.csv
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
enum Column {
    Preset(Preset),
    /// The prize wheel prize in a shop preset's shop
    Prize(Preset),
    Other,
}

impl Column {
    fn named(name: &str) -> Self {
        for preset in ALL {
            if preset.name() == name {
                return Column::Preset(preset);
            }
            if preset.prize_column() == Some(name) {
                return Column::Prize(preset);
            }
        }
        Column::Other
    }
}

/// Every column the Toolbox writes, after the seed
fn all_columns() -> Vec<Column> {
    let mut columns: Vec<_> = ALL.iter().map(|&preset| Column::Preset(preset)).collect();
    columns.extend(PRIZE_WHEEL_SHOPS.iter().map(|&preset| Column::Prize(preset)));
    columns
}

fn column_name(column: Column) -> &'static str {
    match column {
        Column::Preset(preset) => preset.name(),
        Column::Prize(preset) => preset.prize_column().unwrap_or_default(),
        Column::Other => "",
    }
}

/// Adds columns to the end of a csv, through a temp file so a failure
/// leaves it as it was
fn add_csv_columns(path: &Path, header_width: usize, columns: &[Column]) -> anyhow::Result<()> {
    let contents = fs::read_to_string(path)?;
    let temp = path.with_extension("csv.tmp");
    {
        let mut out = BufWriter::new(File::create(&temp)?);
        let names: Vec<_> = columns.iter().map(|&column| column_name(column)).collect();
        for (idx, line) in contents.lines().enumerate() {
            let line = line.trim_end();
            if idx == 0 {
                writeln!(out, "{},{}", line, names.join(","))?;
            } else if !line.is_empty() {
                // Pad rows from before columns were added, then the new ones
                let cells = line.split(',').count();
                let padding = header_width.saturating_sub(cells) + columns.len();
                writeln!(out, "{}{}", line, ",".repeat(padding))?;
            }
        }
        out.flush()?;
    }
    fs::rename(&temp, path)?;
    Ok(())
}

/// Appends rows to a seed_search.csv, in its column order if it already has
/// one, so the same file can be used here and in SpecsHD
struct CsvOutput {
    writer: BufWriter<File>,
    // Each column after the seed
    columns: Vec<Column>,
}

impl CsvOutput {
    fn open(path: &Path) -> anyhow::Result<Self> {
        let header = match File::open(path) {
            Ok(file) => {
                let mut line = String::new();
                BufReader::new(file).read_line(&mut line)?;
                line.trim_end().to_string()
            }
            Err(err) if err.kind() == ErrorKind::NotFound => String::new(),
            Err(err) => return Err(err).context(format!("Couldn't read {}", path.display())),
        };

        let columns = if header.is_empty() {
            let columns = all_columns();
            let names: Vec<_> = columns.iter().map(|&column| column_name(column)).collect();
            fs::write(path, format!("seed,{}\n", names.join(",")))
                .with_context(|| format!("Couldn't write {}", path.display()))?;
            columns
        } else {
            let mut names = header.split(',');
            if names.next() != Some("seed") {
                bail!("{} isn't a seed search csv", path.display());
            }
            let mut columns: Vec<_> = names.map(Column::named).collect();

            let missing: Vec<_> = ALL
                .iter()
                .filter(|&&preset| !columns.contains(&Column::Preset(preset)))
                .map(|preset| preset.name())
                .collect();
            if !missing.is_empty() {
                bail!(
                    "{} has no column for {}. Choose another file.",
                    path.display(),
                    missing.join(", ")
                );
            }

            // Files from SpecsHD or older Toolboxes don't have the prize
            // wheel columns yet
            let new: Vec<_> = all_columns()
                .into_iter()
                .filter(|column| !columns.contains(column))
                .collect();
            if !new.is_empty() {
                add_csv_columns(path, columns.len() + 1, &new)
                    .with_context(|| format!("Couldn't add columns to {}", path.display()))?;
                columns.extend(new);
            }
            columns
        };

        let mut file = OpenOptions::new()
            .append(true)
            .read(true)
            .open(path)
            .with_context(|| format!("Couldn't open {}", path.display()))?;

        // Start on a new line if the file doesn't end with one
        if file.seek(SeekFrom::End(-1)).is_ok() {
            let mut last = [0u8];
            file.read_exact(&mut last)?;
            if last[0] != b'\n' {
                writeln!(file)?;
            }
        }

        Ok(Self {
            writer: BufWriter::new(file),
            columns,
        })
    }

    fn write(
        &mut self,
        seed: u32,
        values: &HashMap<Preset, String>,
        prizes: &HashMap<Preset, String>,
    ) -> anyhow::Result<()> {
        let mut row = vec![seed.to_string()];
        for column in &self.columns {
            let value = match column {
                Column::Preset(preset) => values.get(preset),
                Column::Prize(preset) => prizes.get(preset),
                Column::Other => None,
            };
            row.push(value.cloned().unwrap_or_default());
        }
        writeln!(self.writer, "{}", row.join(","))?;
        Ok(())
    }
}
/// Reads hd-seed-search's output a line at a time as it's written
struct OutputReader {
    path: PathBuf,
    file: Option<File>,
    pending: String,
}

impl OutputReader {
    fn new(path: PathBuf) -> Self {
        Self {
            path,
            file: None,
            pending: String::new(),
        }
    }

    fn read_lines(&mut self) -> anyhow::Result<Vec<String>> {
        if self.file.is_none() {
            match File::open(&self.path) {
                Ok(file) => self.file = Some(file),
                // hd-seed-search hasn't got as far as creating it
                Err(err) if err.kind() == ErrorKind::NotFound => return Ok(vec![]),
                Err(err) => return Err(err.into()),
            }
        }

        if let Some(file) = &mut self.file {
            file.read_to_string(&mut self.pending)?;
        }

        let mut lines = vec![];
        while let Some(end) = self.pending.find('\n') {
            lines.push(self.pending[..end].trim_end().to_string());
            self.pending.drain(..=end);
        }
        Ok(lines)
    }
}

/// The last few lines of hd-seed-search's log, which says why it stopped
fn log_tail(path: &Path) -> String {
    let log = fs::read_to_string(path).unwrap_or_default();
    let lines: Vec<_> = log.lines().collect();
    lines[lines.len().saturating_sub(5)..].join("\n")
}

struct Search {
    presets: Vec<Preset>,
    csv: CsvOutput,
    progress: Progress,
    first_seed_at: Option<Instant>,
}

impl Search {
    fn add_lines(&mut self, lines: Vec<String>) -> anyhow::Result<()> {
        for line in lines.iter().filter(|line| !line.is_empty()) {
            let generated: GeneratedSeed =
                serde_json::from_str(line).context("hd-seed-search wrote something that isn't a seed")?;
            let levels = Levels::new(generated.levels);

            let mut values = HashMap::new();
            for &preset in &self.presets {
                // Every preset is checked on its own, without SpecsHD's
                // dependencies, so path anubis is checked even without a
                // low% bm
                if let Some(value) = evaluate(preset, &levels, &[]) {
                    if preset.is_match(&value) {
                        *self.progress.hits.entry(preset).or_default() += 1;
                    }
                    values.insert(preset, value);
                }
            }

            let prizes: HashMap<_, _> = PRIZE_WHEEL_SHOPS
                .iter()
                .filter_map(|&preset| Some((preset, prize(preset, &levels)?)))
                .collect();

            self.csv.write(generated.seed, &values, &prizes)?;
            self.progress.new_results.push(SeedResult {
                seed: generated.seed,
                display: displayed(&values, &prizes),
                values,
            });

            self.progress.checked += 1;
            self.progress.state = SearchState::Running;
            self.first_seed_at.get_or_insert_with(Instant::now);
        }

        if let Some(first_seed_at) = self.first_seed_at {
            let seconds = first_seed_at.elapsed().as_secs_f64();
            if seconds > 0.0 {
                self.progress.seeds_per_second = f64::from(self.progress.checked) / seconds;
            }
        }
        Ok(())
    }

    /// The progress so far, with the results since the last call
    fn take_progress(&mut self) -> anyhow::Result<Progress> {
        self.csv.writer.flush()?;
        let progress = self.progress.clone();
        self.progress.new_results.clear();
        Ok(progress)
    }
}

pub struct SeedSearchTask {
    shutdown_rx: oneshot::Receiver<()>,
    app_handle: AppHandle,
    options: SeedSearchOptions,
}

impl SeedSearchTask {
    pub fn new(app_handle: AppHandle, options: SeedSearchOptions) -> (Self, oneshot::Sender<()>) {
        let (shutdown_tx, shutdown_rx) = oneshot::channel();
        (
            Self {
                shutdown_rx,
                app_handle,
                options,
            },
            shutdown_tx,
        )
    }

    pub async fn run(&mut self) {
        debug!("SeedSearchTask::run - start");
        if let Err(err) = self.search().await {
            error!("Seed search failed: {:?}", err);
            emit(&self.app_handle, SeedSearchUpdate::Failure(format!("{:#}", err)));
        }
        debug!("SeedSearchTask::run - end");
    }

    async fn search(&mut self) -> anyhow::Result<()> {
        let app_handle = self.app_handle.clone();
        let options = &self.options;

        // Everything is searched for, and the Toolbox filters what's shown
        let presets = ALL.to_vec();
        let levels = presets.iter().map(|preset| preset.last_level()).max().unwrap_or(1);

        // Where Steam installed it, like the Toolbox's Launch button uses
        let game_dir = steam::spelunky_dir()?;
        let generator = app_handle
            .path_resolver()
            .resolve_resource(SEED_SEARCH_RESOURCE)
            .filter(|path| path.exists())
            .context("hd-seed-search.exe is missing from the Toolbox install")?;

        let work_dir = std::env::temp_dir().join("hd-toolbox-seed-search");
        fs::create_dir_all(&work_dir)?;
        let seeds_path = work_dir.join("seeds.txt");
        let out_path = work_dir.join("levels.jsonl");
        let log_path = work_dir.join("levels.jsonl.log");
        let seeds: Vec<_> = random_seeds(options.seed_count)
            .iter()
            .map(u32::to_string)
            .collect();
        fs::write(&seeds_path, seeds.join("\n") + "\n")?;
        // Don't read the last search's output
        fs::remove_file(&out_path).ok();

        let mut search = Search {
            csv: CsvOutput::open(&results_csv(&app_handle, &options.output_csv)?)?,
            progress: Progress {
                state: SearchState::Starting,
                checked: 0,
                total: options.seed_count,
                seeds_per_second: 0.0,
                hits: presets.iter().map(|&preset| (preset, 0)).collect(),
                new_results: vec![],
            },
            presets,
            first_seed_at: None,
        };
        emit(&app_handle, SeedSearchUpdate::SeedSearch(search.take_progress()?));

        let mut child = Command::new(&generator)
            .arg(&seeds_path)
            .arg(&out_path)
            .arg(levels.to_string())
            .arg(&game_dir)
            .creation_flags(CREATE_NO_WINDOW)
            .stdin(Stdio::null())
            .stdout(Stdio::null())
            .stderr(Stdio::piped())
            .kill_on_drop(true)
            .spawn()
            .context("Couldn't start hd-seed-search.exe")?;

        let mut reader = OutputReader::new(out_path);
        let mut tick = interval(Duration::from_millis(250));
        tick.set_missed_tick_behavior(MissedTickBehavior::Skip);

        let mut stopped = false;
        let status = loop {
            select! {
                _ = &mut self.shutdown_rx => {
                    stopped = true;
                    break None;
                }
                status = child.wait() => {
                    break Some(status?);
                }
                _ = tick.tick() => {
                    search.add_lines(reader.read_lines()?)?;
                    emit(&app_handle, SeedSearchUpdate::SeedSearch(search.take_progress()?));
                }
            }
        };

        if stopped {
            // hd-seed-search keeps the game in a job, so it goes too
            child.kill().await.ok();
        }

        search.add_lines(reader.read_lines()?)?;
        search.progress.state = match status {
            None => SearchState::Stopped,
            Some(status) if status.success() => SearchState::Finished,
            Some(status) => {
                let mut stderr = String::new();
                if let Some(mut pipe) = child.stderr.take() {
                    pipe.read_to_string(&mut stderr).await.ok();
                }
                emit(&app_handle, SeedSearchUpdate::SeedSearch(search.take_progress()?));
                bail!(
                    "hd-seed-search stopped ({}). {}\n{}",
                    status,
                    stderr.trim(),
                    log_tail(&log_path)
                );
            }
        };
        emit(&app_handle, SeedSearchUpdate::SeedSearch(search.take_progress()?));
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn temp_csv(name: &str, contents: Option<&str>) -> PathBuf {
        let path = std::env::temp_dir().join(format!(
            "hdt-seed-search-{}-{}.csv",
            name,
            std::process::id()
        ));
        fs::remove_file(&path).ok();
        if let Some(contents) = contents {
            fs::write(&path, contents).unwrap();
        }
        path
    }

    fn write_row(
        path: &Path,
        seed: u32,
        values: &[(Preset, &str)],
        prizes: &[(Preset, &str)],
    ) -> String {
        let to_map = |pairs: &[(Preset, &str)]| -> HashMap<Preset, String> {
            pairs
                .iter()
                .map(|(preset, value)| (*preset, value.to_string()))
                .collect()
        };
        let mut csv = CsvOutput::open(path).unwrap();
        csv.write(seed, &to_map(values), &to_map(prizes)).unwrap();
        csv.writer.flush().unwrap();
        drop(csv);
        let written = fs::read_to_string(path).unwrap();
        fs::remove_file(path).ok();
        written
    }

    #[test]
    fn new_csv_has_every_column() {
        let path = temp_csv("new", None);
        let written = write_row(
            &path,
            7,
            &[(Preset::Crates11, "none"), (Preset::Shop13, "Prize Wheel")],
            &[(Preset::Shop13, "Jetpack")],
        );
        let lines: Vec<_> = written.lines().collect();
        assert_eq!(
            lines,
            [
                "seed,1-1 crate contents,1-2 shop items,1-3 shop items,mines eggy,\
                 jungle worm,ice caves worm,low% bm,altar+moai,path anubis,\
                 1-2 prize wheel,1-3 prize wheel",
                "7,none,,Prize Wheel,,,,,,,,Jetpack",
            ]
        );
    }

    #[test]
    fn appends_in_an_existing_csvs_column_order() {
        // SpecsHD's own file has its columns in the order the presets were
        // added, and no newline after the last row. It gets the prize wheel
        // columns added.
        let path = temp_csv(
            "existing",
            Some(
                "seed,1-1 crate contents,1-2 shop items,mines eggy,jungle worm,\
                 ice caves worm,low% bm,1-3 shop items,altar+moai,path anubis\n\
                 1,none,none,false,false,false,false,n/a,n/a,n/a",
            ),
        );
        let written = write_row(
            &path,
            2,
            &[(Preset::Shop13, "Jetpack"), (Preset::JungleWorm, "true")],
            &[],
        );
        let lines: Vec<_> = written.lines().collect();
        assert_eq!(lines.len(), 3);
        assert!(lines[0].ends_with(",path anubis,1-2 prize wheel,1-3 prize wheel"));
        assert_eq!(lines[1], "1,none,none,false,false,false,false,n/a,n/a,n/a,,");
        assert_eq!(lines[2], "2,,,,true,,,Jetpack,,,,");
    }

    #[test]
    fn loads_prizes_back() {
        let path = temp_csv(
            "load",
            Some(
                "seed,1-1 crate contents,1-2 shop items,1-3 shop items,mines eggy,\
                 jungle worm,ice caves worm,low% bm,altar+moai,path anubis,\
                 1-2 prize wheel,1-3 prize wheel\n\
                 5,none,Bomb Bag,Prize Wheel,false,true,true,false,n/a,n/a,,Cape\n",
            ),
        );
        let results = load_results(&path).unwrap();
        fs::remove_file(&path).ok();
        assert_eq!(results.len(), 1);
        assert_eq!(results[0].values[&Preset::Shop13], "Prize Wheel");
        assert_eq!(results[0].display[&Preset::Shop13], "Prize:Cape");
        assert_eq!(results[0].display[&Preset::Shop12], "Bomb Bag");
    }
    #[test]
    fn rejects_a_csv_without_every_column() {
        let path = temp_csv("missing", Some("seed,1-1 crate contents\n"));
        let result = CsvOutput::open(&path);
        fs::remove_file(&path).ok();
        assert!(result.is_err());
    }
}
