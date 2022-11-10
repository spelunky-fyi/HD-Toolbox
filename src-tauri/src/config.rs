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

#[derive(Deserialize, Serialize, Debug, Clone, PartialEq, Eq)]
#[serde(rename_all = "kebab-case")]
pub struct SessionConfig {
    //Session Summary
    pub show_session_runs: bool,
    pub show_session_deaths: bool,
    pub show_session_wins: bool,
    pub show_session_kills: bool,
    pub show_session_score: bool,
    pub show_session_time: bool,

    // Run Summary
    pub show_run_speed_stats: bool,
    pub show_run_score_stats: bool,
    pub show_run_il: bool,
    pub show_run_area: bool,
    pub show_run_pace: bool,
}

impl Default for SessionConfig {
    fn default() -> Self {
        Self {
            show_session_runs: true,
            show_session_deaths: false,
            show_session_wins: false,
            show_session_kills: false,
            show_session_score: false,
            show_session_time: false,

            show_run_speed_stats: true,
            show_run_score_stats: false,
            show_run_il: true,
            show_run_area: true,
            show_run_pace: true,
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
