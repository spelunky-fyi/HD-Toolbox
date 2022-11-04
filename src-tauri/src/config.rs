use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Debug)]
#[serde(rename_all = "kebab-case")]
pub struct PacifistConfig {
    pub show_kills: bool,
}

impl Default for PacifistConfig {
    fn default() -> Self {
        Self { show_kills: false }
    }
}

#[derive(Deserialize, Serialize, Debug)]
#[serde(rename_all = "kebab-case")]
pub struct CategoryConfig {
    pub hide_early: bool,
    pub show_no: bool,
    pub show_no_gold: bool,
    pub show_pacifist: bool,
}

impl Default for CategoryConfig {
    fn default() -> Self {
        Self {
            hide_early: false,
            show_no: false,
            show_no_gold: true,
            show_pacifist: true,
        }
    }
}

#[derive(Deserialize, Serialize, Debug)]
#[serde(rename_all = "kebab-case")]
pub struct AutoFixerConfig {
    pub auto_fix_slow_look: bool,
    pub auto_fix_characters: bool,
    pub desired_characters: Vec<u32>,
}

impl Default for AutoFixerConfig {
    fn default() -> Self {
        Self {
            auto_fix_slow_look: true,
            auto_fix_characters: false,
            desired_characters: Vec::new(),
        }
    }
}
