use async_trait::async_trait;
use serde::Serialize;

use hdt_mem_reader::manager::{
    CategoryTrackerPayload, GameState, ManagerHandle, PayloadResponse, ScreenState,
};

use crate::config::SessionConfig;

use super::tracker_task::TrackerTicker;
use super::trackers::Response;

#[derive(Debug, Serialize, Clone, PartialEq, Eq)]
pub struct SessionResponse {
    config: SessionConfig,
    data: SessionState,
    err: Option<String>,
}

#[derive(Debug, Serialize, Clone, PartialEq, Eq)]
struct SessionState {
    runs: u64,
    deaths: u64,
    wins: u64,
    kills: u64,
    score: u64,
    time: u64,

    run_state: RunState,
}

impl Default for SessionState {
    fn default() -> Self {
        Self {
            runs: 1,
            deaths: 0,
            wins: 0,
            kills: 0,
            score: 0,
            time: 0,
            run_state: RunState::default(),
        }
    }
}

impl SessionState {
    fn update(&mut self, prev_gamestate: &GameState, gamestate: &GameState) {
        if gamestate.total_time_ms < prev_gamestate.total_time_ms
            || gamestate.respawn_level != prev_gamestate.respawn_level
        {
            self.runs += 1;
            if self.run_state.died {
                self.deaths += 1;
            }
            if self.run_state.won {
                self.wins += 1;
            }
            self.score += self.run_state.score;
            self.time += self.run_state.time;
            self.kills += self.run_state.kills;
            self.run_state = RunState::default();
            self.run_state.update(&gamestate, &gamestate);
        } else {
            self.run_state.update(&prev_gamestate, &gamestate);
        }
    }
}

#[derive(Debug, Serialize, Clone, PartialEq, Eq)]
struct RunState {
    visit_mothership: bool,
    visit_worm: bool,

    died: bool,
    won: bool,

    kills: u64,
    score: u64,
    time: u64,

    areas: [Option<AreaState>; 5],
}

impl Default for RunState {
    fn default() -> Self {
        Self {
            visit_mothership: false,
            visit_worm: false,

            died: false,
            won: false,

            kills: 0,
            score: 0,
            time: 0,

            areas: [None, None, None, None, None],
        }
    }
}

impl RunState {
    fn update(&mut self, _prev_gamestate: &GameState, gamestate: &GameState) {
        if ![
            ScreenState::LevelCompleted,
            ScreenState::DeathScreen,
            ScreenState::VictoryWalking,
        ]
        .contains(&gamestate.screen_state)
        {
            return;
        }

        if gamestate.screen_state == ScreenState::DeathScreen {
            self.died = true;
        }
        if gamestate.screen_state == ScreenState::VictoryWalking {
            self.won = true;
        }

        self.update_visited(gamestate);

        let mut area_level_idx = (gamestate.level % 4) as usize;
        if self.visit_mothership {
            if area_level_idx >= 3 {
                area_level_idx += 2;
            }
        }

        let area_idx = (gamestate.level as f64 / 4.0).ceil() as usize;

        let area = self.areas[area_idx].get_or_insert_with(AreaState::default);
        if area.levels[area_level_idx].is_some() {
            return;
        }

        // End of level, record stats
        area.levels[area_level_idx] = Some(LevelState {
            is_worm: gamestate.is_worm,
            is_mothership: gamestate.is_mothership,
            time: 0,
            score: 0,
        });
    }

    fn update_visited(&mut self, gamestate: &GameState) {
        if gamestate.is_mothership {
            self.visit_mothership = true;
        }

        if gamestate.is_worm {
            self.visit_worm = true;
        }
    }
}

#[derive(Debug, Serialize, Clone, PartialEq, Eq)]
struct AreaState {
    time: u32,
    time_pace: u32,

    score: u32,
    score_pace: u32,

    levels: [Option<LevelState>; 6],
}

impl Default for AreaState {
    fn default() -> Self {
        Self {
            time: 0,
            time_pace: 0,
            score: 0,
            score_pace: 0,
            levels: [None, None, None, None, None, None],
        }
    }
}

#[derive(Debug, Serialize, Clone, PartialEq, Eq)]
struct LevelState {
    is_worm: bool,
    is_mothership: bool,
    time: u32,
    score: u32,
}

pub struct SessionTracker {
    memory_handle: ManagerHandle,

    prev_gamestate: Option<GameState>,
    curr_gamestate: Option<GameState>,

    session_state: SessionState,
}

impl SessionTracker {
    pub fn new(memory_handle: ManagerHandle) -> Self {
        Self {
            memory_handle,
            prev_gamestate: None,
            curr_gamestate: None,
            session_state: SessionState::default(),
        }
    }

    fn active_response(&mut self, config: &SessionConfig) -> Response {
        Response::Session(SessionResponse {
            config: config.clone(),
            data: self.session_state.clone(),
            err: None,
        })
    }

    fn process_game_state(&mut self, gamestate: GameState) {
        self.prev_gamestate = self.curr_gamestate.take();
        self.curr_gamestate = Some(gamestate);

        let prev_gamestate = match &self.prev_gamestate {
            None => return,
            Some(gamestate) => gamestate,
        };

        let gamestate = match &self.curr_gamestate {
            None => return,
            Some(gamestate) => gamestate,
        };

        self.session_state.update(&prev_gamestate, &gamestate);
    }
}

#[async_trait]
impl TrackerTicker for SessionTracker {
    type Config = SessionConfig;

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
            CategoryTrackerPayload::NoPlayers(_) => self.active_response(config),
            CategoryTrackerPayload::Multiplayer => Response::Session(SessionResponse {
                config: config.clone(),
                data: self.session_state.clone(),
                err: Some("Multiplayer not supported...".into()),
            }),
            CategoryTrackerPayload::InactiveScreenState(_) => self.active_response(config),
            CategoryTrackerPayload::Dead => self.active_response(config),
            CategoryTrackerPayload::GameState(gamestate) => {
                self.process_game_state(gamestate);
                self.active_response(config)
            }
        }
    }
}
