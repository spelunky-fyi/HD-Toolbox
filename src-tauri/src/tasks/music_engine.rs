use std::time::Duration;

use log::{debug, error, warn};
use serde::Serialize;
use serde_json::Value as JsonValue;
use std::collections::HashMap;
use tauri::{self, AppHandle, Manager};
use tokio::select;
use tokio::sync::watch;
use tokio::time::Instant;
use tokio::{
    sync::oneshot,
    time::{interval, interval_at, MissedTickBehavior},
};

use hdt_mem_reader::manager::{ManagerHandle, PayloadRequest, PayloadResponse};

use crate::config::MusicEngineConfig;

use super::TaskUpdate;

static TASK_STATE_MUSIC_ENGINE: &str = "task-state:MusicEngine";

#[derive(Debug, Serialize, Clone, PartialEq, Eq)]
#[serde(tag = "type", content = "data")]
pub enum MusicEngineResponse {
    MusicEngine,
    Failure(String),
}

pub struct MusicEngineTask {
    shutdown_rx: oneshot::Receiver<()>,
    memory_handle: ManagerHandle,
    app_handle: AppHandle,
    config: watch::Receiver<HashMap<String, JsonValue>>,
}

impl MusicEngineTask {
    pub fn new(
        memory_handle: ManagerHandle,
        app_handle: AppHandle,
        config: watch::Receiver<HashMap<String, JsonValue>>,
    ) -> (Self, oneshot::Sender<()>) {
        let (shutdown_tx, shutdown_rx) = oneshot::channel();
        (
            Self {
                shutdown_rx,
                memory_handle,
                app_handle,
                config,
            },
            shutdown_tx,
        )
    }

    fn connected(&self) {
        if let Err(err) = self.app_handle.emit_all(
            TASK_STATE_MUSIC_ENGINE,
            TaskUpdate::MusicEngine(MusicEngineResponse::MusicEngine),
        ) {
            error!("Failed to notify window: {:?}", err);
        }
    }

    pub fn serialize_config(&self) -> MusicEngineConfig {
        let config = self.config.borrow().clone();

        let value = match serde_json::to_value(config) {
            Ok(value) => value,
            Err(err) => {
                warn!("Failed to convert config to JSON Value... {:?}", err);
                return MusicEngineConfig::default();
            }
        };

        match serde_json::from_value(value) {
            Ok(value) => value,
            Err(err) => {
                warn!("Failed to deserialize config, using default... {:?}", err);
                MusicEngineConfig::default()
            }
        }
    }

    pub async fn run(&mut self) {
        debug!("MusicEngineTask::run - start");
        let mut poll_interval = interval(Duration::from_millis(16));
        poll_interval.set_missed_tick_behavior(MissedTickBehavior::Delay);

        if (self.memory_handle.connect().await).is_ok() {
            self.connected();
        }

        let mut last_payload = None;
        let mut last_send = Instant::now();

        let mut _config = self.serialize_config();

        loop {
            select! {
                _ = &mut self.shutdown_rx => {
                    break;
                }
                _ = self.config.changed() => {
                    debug!("Music Engine Config changed.");
                    _config = self.serialize_config();
                }
                _now = poll_interval.tick() => {
                    if let Ok(payload) = self.memory_handle.get_payload(PayloadRequest::MusicEngine).await {
                        if let PayloadResponse::Failure(_) = &payload {
                            poll_interval = interval_at(Instant::now() + Duration::from_secs(1), Duration::from_millis(16));
                            poll_interval.set_missed_tick_behavior(MissedTickBehavior::Delay);
                        }

                        if let Some(last_payload) = &last_payload  {
                            if &payload == last_payload && Instant::now() - last_send < Duration::from_secs(2){
                                continue;
                            }
                        }

                        let task_payload = match &payload {
                            PayloadResponse::MusicEngine(_music_payload) => {
                                debug!("Screen {:?}", payload);
                                TaskUpdate::MusicEngine(MusicEngineResponse::MusicEngine)
                            },
                            PayloadResponse::Failure(err) => TaskUpdate::MusicEngine(MusicEngineResponse::Failure(err.to_string())),
                            _ => TaskUpdate::MusicEngine(MusicEngineResponse::Failure("Unexpected Response from Memory Reader.".into()))
                        };


                        last_send = Instant::now();
                        last_payload = Some(payload.clone());

                        if let Err(err) = self
                            .app_handle
                            .emit_all(TASK_STATE_MUSIC_ENGINE, task_payload)
                        {
                            error!("Failed to notify window: {:?}", err);
                        }
                    }
                }
            }
        }

        debug!("MusicEngine::run - end");
    }
}
