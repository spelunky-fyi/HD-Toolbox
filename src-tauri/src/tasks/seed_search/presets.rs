//! The presets from SpecsHD's seed search (specs/mods/seeded_mode.cpp),
//! worked out from hd-seed-search's levels. Values are formatted the same as its
//! seed_search.csv, so the files work in both.

use std::collections::HashMap;

use serde::{Deserialize, Serialize};

use super::entity_names::entity_name;

const MYSTERY_BOX: u32 = 248;

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct BlackMarket {
    pub path_room: bool,
    pub empty_neighbours: u32,
}

/// One level of hd-seed-search's output
#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Level {
    pub level: u32,
    pub crates: Vec<u32>,
    pub shop: Vec<u32>,
    /// The prize behind a prize wheel, which isn't in shop
    #[serde(default)]
    pub prize_wheel_item: Option<u32>,
    pub shopkeeper: bool,
    pub altar: bool,
    pub damsel: bool,
    pub worm_tongue: bool,
    pub moai: bool,
    pub black_market: Option<BlackMarket>,
    pub anubis: Vec<bool>,
}

/// One line of hd-seed-search's output
#[derive(Deserialize, Debug)]
pub struct GeneratedSeed {
    pub seed: u32,
    pub levels: Vec<Level>,
}

#[derive(Serialize, Deserialize, Clone, Copy, Debug, PartialEq, Eq, Hash)]
pub enum Preset {
    Crates11,
    Shop12,
    Shop13,
    MinesEggy,
    JungleWorm,
    IceCavesWorm,
    LowPercentBm,
    AltarMoai,
    PathAnubis,
}

/// In SpecsHD's order
pub const ALL: [Preset; 9] = [
    Preset::Crates11,
    Preset::Shop12,
    Preset::Shop13,
    Preset::MinesEggy,
    Preset::JungleWorm,
    Preset::IceCavesWorm,
    Preset::LowPercentBm,
    Preset::AltarMoai,
    Preset::PathAnubis,
];

impl Preset {
    /// Its column in seed_search.csv
    pub fn name(self) -> &'static str {
        match self {
            Preset::Crates11 => "1-1 crate contents",
            Preset::Shop12 => "1-2 shop items",
            Preset::Shop13 => "1-3 shop items",
            Preset::MinesEggy => "mines eggy",
            Preset::JungleWorm => "jungle worm",
            Preset::IceCavesWorm => "ice caves worm",
            Preset::LowPercentBm => "low% bm",
            Preset::AltarMoai => "altar+moai",
            Preset::PathAnubis => "path anubis",
        }
    }

    /// What the Toolbox shows it as
    pub fn label(self) -> &'static str {
        match self {
            Preset::Crates11 => "1-1 Crate Contents",
            Preset::Shop12 => "1-2 Shop Items",
            Preset::Shop13 => "1-3 Shop Items",
            Preset::MinesEggy => "Mines Eggy",
            Preset::JungleWorm => "Jungle Worm",
            Preset::IceCavesWorm => "Ice Caves Worm",
            Preset::LowPercentBm => "Low% BM",
            Preset::AltarMoai => "Altar + Moai",
            Preset::PathAnubis => "Path Anubis",
        }
    }

    /// The deepest level it looks at
    pub fn last_level(self) -> u32 {
        match self {
            Preset::Crates11 => 1,
            Preset::Shop12 => 2,
            Preset::Shop13 => 3,
            Preset::MinesEggy => 4,
            Preset::JungleWorm => 5,
            Preset::IceCavesWorm => 9,
            Preset::LowPercentBm => 7,
            Preset::AltarMoai => 11,
            Preset::PathAnubis => 13,
        }
    }

    /// The others list what's there rather than looking for something
    pub fn matchable(self) -> bool {
        !matches!(self, Preset::Crates11 | Preset::Shop12 | Preset::Shop13)
    }

    /// In SpecsHD's seed search, when this is also being searched for and
    /// doesn't match, this preset is n/a. The Toolbox doesn't do this.
    pub fn depends_on(self) -> Option<Preset> {
        match self {
            Preset::AltarMoai => Some(Preset::MinesEggy),
            Preset::PathAnubis => Some(Preset::LowPercentBm),
            _ => None,
        }
    }

    pub fn is_match(self, value: &str) -> bool {
        self.matchable() && value != "false" && value != "n/a"
    }
}

pub struct Levels(HashMap<u32, Level>);

impl Levels {
    pub fn new(levels: Vec<Level>) -> Self {
        Self(levels.into_iter().map(|lvl| (lvl.level, lvl)).collect())
    }

    fn get(&self, level: u32) -> Option<&Level> {
        self.0.get(&level)
    }

    fn all(&self, levels: impl IntoIterator<Item = u32>) -> Option<Vec<(u32, &Level)>> {
        levels
            .into_iter()
            .map(|level| self.get(level).map(|lvl| (level, lvl)))
            .collect()
    }
}

fn level_name(level: u32) -> String {
    format!("{}-{}", (level - 1) / 4 + 1, (level - 1) % 4 + 1)
}

fn names(entity_types: &[u32]) -> String {
    if entity_types.is_empty() {
        return "none".into();
    }
    entity_types
        .iter()
        .map(|&entity_type| entity_name(entity_type))
        .collect::<Vec<_>>()
        .join(";")
}

fn flag(value: bool) -> String {
    if value { "true" } else { "false" }.into()
}

/// The preset's value for a seed, or None without the levels it needs.
/// `searching` applies SpecsHD's dependencies, for the presets it's
/// searching for. The Toolbox passes none, so each preset is checked on its
/// own.
pub fn evaluate(preset: Preset, levels: &Levels, searching: &[Preset]) -> Option<String> {
    if let Some(dependency) = preset.depends_on() {
        if searching.contains(&dependency) && evaluate(dependency, levels, searching)? == "false"
        {
            return Some("n/a".into());
        }
    }

    match preset {
        Preset::Crates11 => Some(names(&levels.get(1)?.crates)),
        Preset::Shop12 => Some(names(&levels.get(2)?.shop)),
        Preset::Shop13 => {
            let lvl = levels.get(3)?;
            Some(if lvl.shopkeeper { names(&lvl.shop) } else { "n/a".into() })
        }

        // Mystery Box for sale and a Kali altar on the same level
        Preset::MinesEggy => {
            let matched: Vec<_> = levels
                .all(2..=4)?
                .into_iter()
                .filter(|(_, lvl)| lvl.shop.contains(&MYSTERY_BOX) && lvl.altar)
                .map(|(level, _)| level_name(level))
                .collect();
            Some(if matched.is_empty() { "false".into() } else { matched.join(";") })
        }

        // Damsel and worm tongue
        Preset::JungleWorm | Preset::IceCavesWorm => {
            let level = if preset == Preset::JungleWorm { 5 } else { 9 };
            let lvl = levels.get(level)?;
            Some(flag(lvl.damsel && lvl.worm_tongue))
        }

        // Only one BM spawns a run, so the first level with one decides it
        Preset::LowPercentBm => {
            for (level, lvl) in levels.all(5..=7)? {
                if let Some(bm) = &lvl.black_market {
                    let good = bm.path_room && bm.empty_neighbours >= 2;
                    return Some(if good { level_name(level) } else { "false".into() });
                }
            }
            Some("false".into())
        }

        // The first level with the moai decides it, and one on 3-1 doesn't
        // count
        Preset::AltarMoai => {
            for (level, lvl) in levels.all(9..=11)? {
                if lvl.moai {
                    let good = level >= 10 && lvl.altar;
                    return Some(if good { level_name(level) } else { "false".into() });
                }
            }
            Some("false".into())
        }

        Preset::PathAnubis => {
            let anubis = &levels.get(13)?.anubis;
            Some(if anubis.is_empty() {
                "n/a".into()
            } else {
                flag(anubis.iter().any(|&path_room| path_room))
            })
        }
    }
}

/// The shops that can be a prize wheel, whose prize isn't in their value
pub const PRIZE_WHEEL_SHOPS: [Preset; 2] = [Preset::Shop12, Preset::Shop13];

impl Preset {
    /// The Toolbox's own csv column for the shop's prize wheel prize. SpecsHD
    /// keeps columns it doesn't know.
    pub fn prize_column(self) -> Option<&'static str> {
        match self {
            Preset::Shop12 => Some("1-2 prize wheel"),
            Preset::Shop13 => Some("1-3 prize wheel"),
            _ => None,
        }
    }
}

/// The item behind the prize wheel in a shop preset's shop, if it's one
pub fn prize(preset: Preset, levels: &Levels) -> Option<String> {
    let level = match preset {
        Preset::Shop12 => 2,
        Preset::Shop13 => 3,
        _ => return None,
    };
    let item = levels.get(level)?.prize_wheel_item?;
    Some(entity_name(item).to_string())
}

/// What the Toolbox shows for a value. The same as the csv, except a prize
/// wheel shows its prize as "Prize:<item>".
pub fn display(value: &str, prize: Option<&str>) -> String {
    match prize {
        Some(prize) => value
            .split(';')
            .map(|name| {
                if name == "Prize Wheel" {
                    format!("Prize:{}", prize)
                } else {
                    name.to_string()
                }
            })
            .collect::<Vec<_>>()
            .join(";"),
        None => value.into(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn parse(line: &str) -> Levels {
        let seed: GeneratedSeed = serde_json::from_str(line).unwrap();
        Levels::new(seed.levels)
    }

    // A seed hd-seed-search generated, and its row in SpecsHD's seed_search.csv:
    // 769403128,none,Bomb Bag;Shotgun;Bomb Bag;Web Gun,false,true,true,false,n/a,n/a,n/a
    const SEED_769403128: &str = include_str!("testdata/769403128.json");

    #[test]
    fn matches_specs_seed_search() {
        let levels = parse(SEED_769403128);
        let value = |preset| evaluate(preset, &levels, &ALL).unwrap();

        assert_eq!(value(Preset::Crates11), "none");
        assert_eq!(value(Preset::MinesEggy), "false");
        assert_eq!(value(Preset::JungleWorm), "true");
        assert_eq!(value(Preset::IceCavesWorm), "true");
        assert_eq!(value(Preset::LowPercentBm), "false");
        assert_eq!(value(Preset::Shop13), "n/a");
        assert_eq!(value(Preset::AltarMoai), "n/a");
        assert_eq!(value(Preset::PathAnubis), "n/a");

        // Same items as the csv, which reads them a frame later in another
        // order
        let mut shop: Vec<_> = value(Preset::Shop12).split(';').map(String::from).collect();
        shop.sort();
        assert_eq!(shop, ["Bomb Bag", "Bomb Bag", "Shotgun", "Web Gun"]);
    }

    #[test]
    fn dependency_only_counts_when_searched_for() {
        // The moai and an altar are on 3-3, but there's no mines eggy
        let levels = parse(SEED_769403128);
        assert_eq!(
            evaluate(Preset::AltarMoai, &levels, &[Preset::AltarMoai]).unwrap(),
            "3-3"
        );
    }

    #[test]
    fn prize_wheel_shows_its_prize() {
        let mut levels = parse(SEED_769403128);
        let shop13 = levels.0.get_mut(&3).unwrap();
        shop13.shop = vec![188];
        shop13.shopkeeper = true;
        shop13.prize_wheel_item = Some(516);

        let value = evaluate(Preset::Shop13, &levels, &ALL).unwrap();
        assert_eq!(value, "Prize Wheel");
        let prize = prize(Preset::Shop13, &levels);
        assert_eq!(prize.as_deref(), Some("Freeze Ray"));
        assert_eq!(display(&value, prize.as_deref()), "Prize:Freeze Ray");
        assert_eq!(super::prize(Preset::Shop12, &levels), None);
    }

    #[test]
    fn missing_levels() {
        let levels = Levels::new(vec![]);
        assert_eq!(evaluate(Preset::Crates11, &levels, &ALL), None);
    }

    /// Checks hd-seed-search output against a SpecsHD seed_search.csv made with
    /// every preset on:
    /// SEED_SEARCH_OUTPUT=levels.jsonl SEED_SEARCH_CSV=seed_search.csv cargo test -- --ignored
    #[test]
    #[ignore]
    fn reproduces_seed_search_csv() {
        use std::{env, fs};

        let output = env::var("SEED_SEARCH_OUTPUT").expect("set SEED_SEARCH_OUTPUT");
        let csv = fs::read_to_string(env::var("SEED_SEARCH_CSV").expect("set SEED_SEARCH_CSV"))
            .unwrap();
        let mut csv_lines = csv.lines();
        let header: Vec<_> = csv_lines.next().unwrap().split(',').collect();
        let rows: HashMap<u32, Vec<&str>> = csv_lines
            .filter_map(|line| {
                let cells: Vec<_> = line.split(',').collect();
                Some((cells[0].parse().ok()?, cells))
            })
            .collect();

        // Lists can be in another order, see matches_specs_seed_search
        let items = |value: &str| {
            let mut items: Vec<_> = value.split(';').map(String::from).collect();
            items.sort();
            items
        };

        let mut checked = 0;
        for line in fs::read_to_string(output).unwrap().lines() {
            let generated: GeneratedSeed = serde_json::from_str(line).unwrap();
            let Some(row) = rows.get(&generated.seed) else {
                continue;
            };
            let seed = generated.seed;
            let levels = Levels::new(generated.levels);
            for preset in ALL {
                let column = header.iter().position(|name| *name == preset.name()).unwrap();
                let expected = row.get(column).copied().unwrap_or("");
                if expected.is_empty() {
                    continue;
                }
                let actual = evaluate(preset, &levels, &ALL).unwrap();
                assert_eq!(items(&actual), items(expected), "seed {seed} {}", preset.name());
                checked += 1;
            }
        }
        assert!(checked > 0);
        println!("{checked} values match");
    }
}
