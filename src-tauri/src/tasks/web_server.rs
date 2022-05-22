use std::time::Duration;

use log::{debug, error, info};
use tauri::{self, AppHandle, Manager};
use tokio::select;
use tokio::{
    sync::oneshot,
    time::{interval, MissedTickBehavior},
};

use hdt_mem_reader::manager::ManagerHandle;

use super::{TaskUpdate, WebServerResponse};

static TASK_STATE_WEB_SERVER: &str = "task-state:WebServer";

pub struct WebServerTask {
    shutdown_rx: oneshot::Receiver<()>,
    memory_handle: ManagerHandle,
    app_handle: AppHandle,
}

impl WebServerTask {
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
            TASK_STATE_WEB_SERVER,
            TaskUpdate::WebServer(WebServerResponse::WebServer),
        ) {
            error!("Failed to notify window: {:?}", err);
        }
    }

    pub async fn run(&mut self) {
        debug!("WebServerTask::run - start");
        let mut poll_interval = interval(Duration::from_secs(5));
        poll_interval.set_missed_tick_behavior(MissedTickBehavior::Delay);

        // TODO: Should use webserver, not mem handle for connect status
        if let Ok(_) = self.memory_handle.connect().await {
            self.connected();
        }

        loop {
            select! {
                _ = &mut self.shutdown_rx => {
                    break;
                }
                _now = poll_interval.tick() => {
                    info!("WebServerTask::run - tick...")
                }
            }
        }

        debug!("WebServerTask::run - end");
    }
}
