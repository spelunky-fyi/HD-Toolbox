use async_trait::async_trait;

use hdt_mem_reader::manager::{CategoryTrackerPayload, GameState, ManagerHandle, PayloadResponse};
use serde::Serialize;

use crate::config::SessionConfig;

use super::tracker_task::TrackerTicker;
use super::trackers::Response;

#[derive(Debug, Serialize, Clone, PartialEq, Eq)]
pub struct SessionResponse {
    data: String,
}

struct SessionState {
    run_state: RunState,
}

impl Default for SessionState {
    fn default() -> Self {
        Self {
            run_state: RunState::default(),
        }
    }
}

impl SessionState {
    fn update(&mut self, prev_gamestate: &GameState, gamestate: &GameState) {
        if gamestate.total_time_ms < prev_gamestate.total_time_ms
            || gamestate.respawn_level != prev_gamestate.respawn_level
        {
            self.run_state = RunState::default();
            self.run_state.update(&gamestate, &gamestate);
        } else {
            self.run_state.update(&prev_gamestate, &gamestate);
        }
    }
}

struct RunState {}

impl Default for RunState {
    fn default() -> Self {
        Self {}
    }
}

impl RunState {
    fn update(&mut self, _prev_gamestate: &GameState, _gamestate: &GameState) {}
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

    fn active_response(&mut self) -> Response {
        Response::Session(SessionResponse {
            data: "Active...".into(),
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

    async fn tick(&mut self, _config: &Self::Config) -> Response {
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
            CategoryTrackerPayload::NoPlayers(_) => Response::Session(SessionResponse {
                data: "Waiting for game...".into(),
            }),
            CategoryTrackerPayload::Multiplayer => Response::Session(SessionResponse {
                data: "Multiplayer not supported...".into(),
            }),
            CategoryTrackerPayload::InactiveScreenState(_) => self.active_response(),
            CategoryTrackerPayload::Dead => self.active_response(),
            CategoryTrackerPayload::GameState(gamestate) => {
                self.process_game_state(gamestate);
                self.active_response()
            }
        }
    }
}
