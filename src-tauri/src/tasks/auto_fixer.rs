use std::time::Duration;

use log::{debug, error, warn};
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

use hdt_mem_reader::manager::{
    AutoFixerPayload, AutoFixerPayloadConfig, ManagerHandle, PayloadRequest, PayloadResponse,
};

use crate::config::AutoFixerConfig;

use super::TaskUpdate;

static TASK_STATE_AUTO_FIXER: &str = "task-state:AutoFixer";

pub struct AutoFixerTask {
    shutdown_rx: oneshot::Receiver<()>,
    memory_handle: ManagerHandle,
    app_handle: AppHandle,
    config: watch::Receiver<HashMap<String, JsonValue>>,
}

impl AutoFixerTask {
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
            TASK_STATE_AUTO_FIXER,
            TaskUpdate::AutoFixer(PayloadResponse::AutoFixer(AutoFixerPayload::default())),
        ) {
            error!("Failed to notify window: {:?}", err);
        }
    }

    pub fn serialize_config(&self) -> AutoFixerConfig {
        let config = self.config.borrow().clone();

        let value = match serde_json::to_value(config) {
            Ok(value) => value,
            Err(err) => {
                warn!("Failed to convert config to JSON Value... {:?}", err);
                return AutoFixerConfig::default();
            }
        };

        match serde_json::from_value(value) {
            Ok(value) => value,
            Err(err) => {
                warn!("Failed to deserialize config, using default... {:?}", err);
                AutoFixerConfig::default()
            }
        }
    }

    pub async fn run(&mut self) {
        debug!("AutoFixerTask::run - start");
        let mut poll_interval = interval(Duration::from_millis(16));
        poll_interval.set_missed_tick_behavior(MissedTickBehavior::Delay);

        if (self.memory_handle.connect().await).is_ok() {
            self.connected();
        }

        let mut last_payload = None;
        let mut last_send = Instant::now();

        let mut config = self.serialize_config();

        loop {
            select! {
                _ = &mut self.shutdown_rx => {
                    break;
                }
                _ = self.config.changed() => {
                    debug!("Auto Fixer Config changed.");
                    config = self.serialize_config();
                }
                _now = poll_interval.tick() => {
                    if let Ok(payload) = self.memory_handle.get_payload(PayloadRequest::AutoFixer(AutoFixerPayloadConfig{
                        auto_fix_slow_look: config.auto_fix_slow_look ,
                        auto_fix_characters: config.auto_fix_characters,
                        desired_characters: config.desired_characters.clone(),
                    })).await {
                        if let PayloadResponse::Failure(_) = &payload {
                            poll_interval = interval_at(Instant::now() + Duration::from_secs(1), Duration::from_millis(16));
                            poll_interval.set_missed_tick_behavior(MissedTickBehavior::Delay);
                        }

                        if let Some(last_payload) = &last_payload  {
                            if &payload == last_payload && Instant::now() - last_send < Duration::from_secs(2){
                                continue;
                            }
                        }

                        last_send = Instant::now();
                        last_payload = Some(payload.clone());

                        if let Err(err) = self
                            .app_handle
                            .emit_all(TASK_STATE_AUTO_FIXER, TaskUpdate::AutoFixer(payload))
                        {
                            error!("Failed to notify window: {:?}", err);
                        }
                    }
                }
            }
        }

        debug!("AutoFixerTask::run - end");
    }
}
