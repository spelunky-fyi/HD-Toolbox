use std::collections::HashSet;

use async_trait::async_trait;

use hdt_cat_labels::{Label, LabelType, RunLabels, TerminusLabel};
use hdt_mem_reader::manager::{CategoryTrackerPayload, GameState, ManagerHandle, PayloadResponse};
use serde::Serialize;

use crate::config::CategoryConfig;

use super::tracker_task::TrackerTicker;
use super::trackers::Response;

#[derive(Debug, Serialize, Clone, PartialEq, Eq)]
pub struct CategoryResponse {
    category: String,
}

#[derive(Default)]
struct RunState {
    prev_gamestate: Option<GameState>,
    curr_gamestate: Option<GameState>,
    run_labels: RunLabels,
}

pub struct CategoryTracker {
    memory_handle: ManagerHandle,
    run_state: RunState,
}

impl CategoryTracker {
    pub fn new(memory_handle: ManagerHandle) -> Self {
        Self {
            memory_handle,
            run_state: RunState::default(),
        }
    }

    fn should_show_modifiers(&self, config: &CategoryConfig) -> bool {
        if !config.hide_early {
            return true;
        }

        if let Some(game_state) = &self.run_state.curr_gamestate {
            if game_state.level > 2 {
                return true;
            }
        }

        return false;
    }

    fn get_excluded_labels(config: &CategoryConfig) -> HashSet<LabelType> {
        let mut excludes = HashSet::new();
        if !config.show_no {
            excludes.insert(LabelType::Label(Label::No));
        }
        if !config.show_no_gold {
            excludes.insert(LabelType::Label(Label::NoGold));
        }
        if !config.show_pacifist {
            excludes.insert(LabelType::Label(Label::Pacifist));
        }
        excludes
    }

    fn active_response(&mut self, config: &CategoryConfig) -> Response {
        let exclude_labels = Self::get_excluded_labels(config);
        Response::Category(CategoryResponse {
            category: self
                .run_state
                .run_labels
                .get_text(!self.should_show_modifiers(config), &exclude_labels),
        })
    }

    fn process_game_state(&mut self, game_state: GameState) {
        self.run_state.prev_gamestate = self.run_state.curr_gamestate.take();
        self.run_state.curr_gamestate = Some(game_state);

        let prev_game_state = match &self.run_state.prev_gamestate {
            None => return,
            Some(game_state) => game_state,
        };

        let game_state = match &self.run_state.curr_gamestate {
            None => return,
            Some(game_state) => game_state,
        };

        if game_state.total_time_ms < prev_game_state.total_time_ms
            || game_state.respawn_level != prev_game_state.respawn_level
        {
            if game_state.respawn_level == 8 {
                self.run_state.run_labels = RunLabels::new_max_ics()
            } else if game_state.respawn_level == 12 {
                self.run_state.run_labels = RunLabels::new_temple_shortcut()
            } else {
                self.run_state.run_labels = RunLabels::default();
            }
        }
    }
}

#[async_trait]
impl TrackerTicker for CategoryTracker {
    type Config = CategoryConfig;

    async fn startup(&mut self) -> Option<Response> {
        if let Err(_) = self.memory_handle.connect().await {
            return Some(Response::Failure("Failed to connect to process.".into()));
        }
        None
    }

    async fn tick(&mut self, config: &Self::Config) -> Response {
        let payload = match self
            .memory_handle
            .get_payload(hdt_mem_reader::manager::PayloadRequest::CategoryTracker)
            .await
        {
            Err(err) => {
                return Response::Failure(err.to_string());
            }
            Ok(PayloadResponse::Failure(err)) => {
                return Response::Failure(err.to_string());
            }
            Ok(PayloadResponse::CategoryTracker(category_data)) => category_data,
            _ => panic!("Got unexpected response..."),
        };

        match payload {
            CategoryTrackerPayload::NoPlayers(_) => Response::Category(CategoryResponse {
                category: "Waiting for game...".into(),
            }),
            CategoryTrackerPayload::Multiplayer => Response::Category(CategoryResponse {
                category: "Multiplayer not supported...".into(),
            }),
            CategoryTrackerPayload::InactiveScene(_) => self.active_response(config),
            CategoryTrackerPayload::Dead => {
                // TODO: Handle Pacifist
                self.run_state.run_labels.set_terminus(TerminusLabel::Death);
                self.active_response(config)
            }
            CategoryTrackerPayload::GameState(game_state) => {
                self.process_game_state(game_state);
                self.active_response(config)
            }
        }
    }
}
