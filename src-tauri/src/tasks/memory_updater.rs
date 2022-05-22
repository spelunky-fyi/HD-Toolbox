use std::time::Duration;

use log::{debug, error};
use tauri::{self, AppHandle, Manager};
use tokio::select;
use tokio::time::Instant;
use tokio::{
    sync::oneshot,
    time::{interval, interval_at, MissedTickBehavior},
};

use hdt_mem_reader::manager::{
    ManagerHandle, MemoryUpdaterPayload, PayloadRequest, PayloadResponse,
};

use super::TaskUpdate;

static TASK_STATE_MEMORY_UPDATER: &str = "task-state:MemoryUpdater";

pub struct MemoryUpdaterTask {
    shutdown_rx: oneshot::Receiver<()>,
    memory_handle: ManagerHandle,
    app_handle: AppHandle,
}

impl MemoryUpdaterTask {
    pub fn new(memory_handle: ManagerHandle, app_handle: AppHandle) -> (Self, oneshot::Sender<()>) {
        let (shutdown_tx, shutdown_rx) = oneshot::channel();
        (
            Self {
                shutdown_rx,
                memory_handle,
                app_handle,
            },
            shutdown_tx,
        )
    }

    fn connected(&self) {
        if let Err(err) = self.app_handle.emit_all(
            TASK_STATE_MEMORY_UPDATER,
            TaskUpdate::MemoryUpdater(PayloadResponse::MemoryUpdater(
                MemoryUpdaterPayload::default(),
            )),
        ) {
            error!("Failed to notify window: {:?}", err);
        }
    }

    pub async fn run(&mut self) {
        debug!("MemoryUpdaterTask::run - start");
        let mut poll_interval = interval(Duration::from_millis(16));
        poll_interval.set_missed_tick_behavior(MissedTickBehavior::Delay);

        if let Ok(_) = self.memory_handle.connect().await {
            self.connected();
        }

        let mut last_payload = None;
        let mut last_send = Instant::now();

        loop {
            select! {
                _ = &mut self.shutdown_rx => {
                    break;
                }
                _now = poll_interval.tick() => {
                    if let Ok(payload) = self.memory_handle.get_payload(PayloadRequest::MemoryUpdater).await {
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
                            .emit_all(TASK_STATE_MEMORY_UPDATER, TaskUpdate::MemoryUpdater(payload))
                        {
                            error!("Failed to notify window: {:?}", err);
                        }
                    }
                }
            }
        }

        debug!("MemoryUpdaterTask::run - end");
    }
}
