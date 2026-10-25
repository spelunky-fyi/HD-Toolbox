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
    /// How many lavafalls there are, from hd-seed-search 0.2.0
    #[serde(default)]
    pub lavafalls: Option<u32>,
    #[serde(default)]
    pub city_of_gold: bool,
    /// Hired hands for sale, from hd-seed-search 0.2.0
    #[serde(default)]
    pub hired_hands: Option<u32>,
    #[serde(default)]
    pub rooms: Vec<u32>,
}

/// The hired hand shop room, and the same facing the other way
const HIRED_HAND_SHOP_ROOMS: [u32; 2] = [106, 10106];

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
    Lavafalls,
    PreTempleBombs,
}

/// In SpecsHD's order, then the Toolbox's own
pub const ALL: [Preset; 11] = [
    Preset::Crates11,
    Preset::Shop12,
    Preset::Shop13,
    Preset::MinesEggy,
    Preset::JungleWorm,
    Preset::IceCavesWorm,
    Preset::LowPercentBm,
    Preset::AltarMoai,
    Preset::PathAnubis,
    Preset::Lavafalls,
    Preset::PreTempleBombs,
];

/// The levels before the temple, 1-1 to 3-4
const PRE_TEMPLE_LEVELS: std::ops::RangeInclusive<u32> = 1..=12;
const BOMB_BAG: u32 = 501;
const BOMB_BOX: u32 = 502;

/// The temple and hell levels lavafalls are looked for on. 4-3 is the City of
/// Gold.
const LAVAFALL_LEVELS: [u32; 6] = [13, 14, 15, 17, 18, 19];
const CITY_OF_GOLD_LEVEL: u32 = 15;

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
            Preset::Lavafalls => "lavafalls",
            Preset::PreTempleBombs => "pre-temple bombs",
        }
    }

    /// Whether SpecsHD's seed search has it. A csv has to have a column for
    /// each of these, and the Toolbox adds the others.
    pub fn in_specs(self) -> bool {
        !matches!(self, Preset::Lavafalls | Preset::PreTempleBombs)
    }

    /// How the Toolbox shows and filters it: "flag" for a yes or no (with
    /// levels), "list" for the items somewhere, "count" for a number
    pub fn kind(self) -> &'static str {
        match self {
            Preset::PreTempleBombs => "count",
            _ if self.matchable() => "flag",
            _ => "list",
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
            Preset::Lavafalls => "Lavafalls",
            Preset::PreTempleBombs => "Pre-Temple Bombs",
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
            Preset::Lavafalls => 19,
            Preset::PreTempleBombs => 12,
        }
    }

    /// The others list what's there or count something rather than looking
    /// for something
    pub fn matchable(self) -> bool {
        !matches!(
            self,
            Preset::Crates11 | Preset::Shop12 | Preset::Shop13 | Preset::PreTempleBombs
        )
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
        self.matchable() && value != "false" && value != "n/a" && value != "none"
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
            if !lvl.shopkeeper {
                return Some("n/a".into());
            }
            // A hired hand shop sells no items, which SpecsHD lists as none.
            // "HH Shop:<hired hands>", with a generator that counts them.
            let hh_shop = lvl.rooms.iter().any(|room| HIRED_HAND_SHOP_ROOMS.contains(room));
            Some(match lvl.hired_hands {
                Some(hired_hands) if hh_shop && hired_hands > 0 => {
                    format!("HH Shop:{}", hired_hands)
                }
                _ => names(&lvl.shop),
            })
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

        // The levels with at least one. Older hd-seed-search releases don't
        // count them or make 4-3 the City of Gold, so there's no value.
        Preset::Lavafalls => {
            let mut matched = vec![];
            for (level, lvl) in levels.all(LAVAFALL_LEVELS)? {
                if level == CITY_OF_GOLD_LEVEL && !lvl.city_of_gold {
                    return None;
                }
                if lvl.lavafalls? > 0 {
                    matched.push(level_name(level));
                }
            }
            Some(if matched.is_empty() { "none".into() } else { matched.join(";") })
        }

        // The bombs in every shop item, prize wheel prize and crate before the
        // temple, 3 for a bomb bag and 12 for a bomb box
        Preset::PreTempleBombs => {
            let bombs: u32 = levels
                .all(PRE_TEMPLE_LEVELS)?
                .iter()
                .flat_map(|(_, lvl)| {
                    lvl.shop.iter().chain(&lvl.crates).chain(&lvl.prize_wheel_item)
                })
                .map(|&item| match item {
                    BOMB_BAG => 3,
                    BOMB_BOX => 12,
                    _ => 0,
                })
                .sum();
            Some(bombs.to_string())
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

    // A level with this many lavafalls, as hd-seed-search 0.2.0 writes
    fn lavafall_level(level: u32, lavafalls: Option<u32>) -> Level {
        let mut lvl = parse(SEED_769403128).0.remove(&1).unwrap();
        lvl.level = level;
        lvl.lavafalls = lavafalls;
        lvl.city_of_gold = level == CITY_OF_GOLD_LEVEL;
        lvl
    }

    #[test]
    fn lavafalls_lists_their_levels() {
        let counts = [(13, 0), (14, 2), (15, 1), (16, 5), (17, 0), (18, 0), (19, 1)];
        let levels =
            Levels::new(counts.iter().map(|&(level, n)| lavafall_level(level, Some(n))).collect());
        // 4-4 isn't looked at
        let value = evaluate(Preset::Lavafalls, &levels, &ALL).unwrap();
        assert_eq!(value, "4-2;4-3;5-3");
        assert!(Preset::Lavafalls.is_match(&value));

        let none = Levels::new(LAVAFALL_LEVELS.iter().map(|&l| lavafall_level(l, Some(0))).collect());
        let value = evaluate(Preset::Lavafalls, &none, &ALL).unwrap();
        assert_eq!(value, "none");
        assert!(!Preset::Lavafalls.is_match(&value));
    }

    #[test]
    fn lavafalls_need_a_generator_that_counts_them() {
        // hd-seed-search 0.1.0 has no lavafall counts or City of Gold
        let old = Levels::new(LAVAFALL_LEVELS.iter().map(|&l| lavafall_level(l, None)).collect());
        assert_eq!(evaluate(Preset::Lavafalls, &old, &ALL), None);

        let mut levels: Vec<_> = LAVAFALL_LEVELS.iter().map(|&l| lavafall_level(l, Some(1))).collect();
        levels[2].city_of_gold = false;
        assert_eq!(evaluate(Preset::Lavafalls, &Levels::new(levels), &ALL), None);
    }

    #[test]
    fn pre_temple_bombs_counts_shops_and_crates_up_to_3_4() {
        let level = |level: u32, shop: Vec<u32>, crates: Vec<u32>| {
            let mut lvl = lavafall_level(level, None);
            lvl.shop = shop;
            lvl.crates = crates;
            lvl
        };
        let mut levels: Vec<_> = (1..=13).map(|l| level(l, vec![], vec![])).collect();
        levels[0] = level(1, vec![], vec![BOMB_BAG]);
        // Other items, and bombs in both a shop and a crate
        levels[1] = level(2, vec![BOMB_BAG, BOMB_BOX, 516, BOMB_BAG], vec![]);
        levels[11] = level(12, vec![BOMB_BOX], vec![BOMB_BAG]);
        // A prize wheel's prize counts too
        levels[4].prize_wheel_item = Some(BOMB_BOX);
        levels[5].prize_wheel_item = Some(516);
        // 4-1 isn't counted
        levels[12] = level(13, vec![BOMB_BOX], vec![]);
        let levels = Levels::new(levels);
        assert_eq!(evaluate(Preset::PreTempleBombs, &levels, &ALL).unwrap(), "48");
        assert!(!Preset::PreTempleBombs.is_match("48"));
        assert_eq!(Preset::PreTempleBombs.kind(), "count");
    }

    #[test]
    fn hired_hand_shop_on_1_3() {
        let mut levels = parse(SEED_769403128);
        let lvl = levels.0.get_mut(&3).unwrap();
        lvl.shopkeeper = true;
        lvl.shop = vec![];
        lvl.rooms = vec![2, 1, 0, 0, 10106];
        lvl.hired_hands = Some(2);
        assert_eq!(evaluate(Preset::Shop13, &levels, &ALL).unwrap(), "HH Shop:2");

        // An older generator doesn't count them, so it's none like SpecsHD
        levels.0.get_mut(&3).unwrap().hired_hands = None;
        assert_eq!(evaluate(Preset::Shop13, &levels, &ALL).unwrap(), "none");
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
            for preset in ALL.into_iter().filter(|preset| preset.in_specs()) {
                let column = header.iter().position(|name| *name == preset.name()).unwrap();
                let expected = row.get(column).copied().unwrap_or("");
                if expected.is_empty() {
                    continue;
                }
                let mut actual = evaluate(preset, &levels, &ALL).unwrap();
                // SpecsHD has a hired hand shop as none
                if actual.starts_with("HH Shop:") {
                    actual = "none".into();
                }
                assert_eq!(items(&actual), items(expected), "seed {seed} {}", preset.name());
                checked += 1;
            }
        }
        assert!(checked > 0);
        println!("{checked} values match");
    }
}
