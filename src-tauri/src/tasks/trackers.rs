use std::time::Duration;

use hdt_mem_reader::manager::ManagerHandle;
use log::debug;
use serde::Serialize;
use tokio::select;
use tokio::sync::{mpsc, oneshot, watch};
use tokio::time::interval;
use tokio::time::MissedTickBehavior;

#[derive(Debug, Serialize)]
pub struct CategoryResponse {}

#[derive(Debug, Serialize)]
pub struct PacifistResponse {}

#[derive(Debug, Serialize)]
pub enum Response {
    Category(CategoryResponse),
    Pacifist(PacifistResponse),
}

#[derive(Debug)]
pub enum TrackerType {
    Category,
    Pacifist,
}

#[derive(Debug)]
pub enum Message {
    GetWatcher(
        TrackerType,
        oneshot::Sender<Result<watch::Receiver<Response>, anyhow::Error>>,
    ),
    Shutdown(oneshot::Sender<()>),
}

pub struct TrackerManager {
    // Channel for communicating with the Tracker Manager
    handle_tx: mpsc::Sender<Message>,

    // Channel for listening to inbound messages
    handle_rx: mpsc::Receiver<Message>,

    // Channel for shutting down the Task
    shutdown_tx: Option<oneshot::Sender<()>>,

    memory_manager: ManagerHandle,
}

impl TrackerManager {
    pub fn new(memory_manager: ManagerHandle) -> Self {
        let (handle_tx, handle_rx) = mpsc::channel::<Message>(100);
        Self {
            handle_tx,
            handle_rx,
            shutdown_tx: None,
            memory_manager,
        }
    }

    pub async fn run_in_background(memory_manager: ManagerHandle) -> Handle {
        debug!("Spawning thread for Tracker Manager");
        let (tx, rx) = oneshot::channel::<Handle>();
        tauri::async_runtime::spawn(async move {
            let mut manager = TrackerManager::new(memory_manager);
            let handle = manager.get_handle();
            let _ = tx.send(handle);
            manager.run_forever().await;
        });
        rx.await.expect("Failed to run Tracker Manger")
    }

    pub fn get_handle(&self) -> Handle {
        Handle {
            handle_tx: self.handle_tx.clone(),
        }
    }

    pub async fn run_forever(&mut self) {
        debug!("Running Tracker Manger!");
        let mut poll_interval = interval(Duration::from_secs(1));
        poll_interval.set_missed_tick_behavior(MissedTickBehavior::Delay);

        let (shutdown_tx, mut shutdown_rx) = oneshot::channel();
        self.shutdown_tx = Some(shutdown_tx);

        loop {
            select! {
                _ = &mut shutdown_rx => {
                    debug!("Shutting down Tracker Manager!");
                    break;
                }
                _ = poll_interval.tick() => {
                    // Check dead tasks.

                }
                msg = self.handle_rx.recv() => {
                    if let Some(msg) = msg {
                        self.handle_msg(msg).await;
                    }
                }
            }
        }
    }

    async fn handle_msg(&mut self, msg: Message) {
        match msg {
            Message::Shutdown(response) => {
                self.handle_shutdown(response);
            }
            Message::GetWatcher(tracker_type, response) => {
                self.handle_get_watcher(tracker_type, response);
            }
        };
    }

    fn handle_shutdown(&mut self, response: oneshot::Sender<()>) {
        if let Some(tx) = self.shutdown_tx.take() {
            let _ = tx.send(());
        }
        let _ = response.send(());
    }

    fn handle_get_watcher(
        &mut self,
        tracker_type: TrackerType,
        response: oneshot::Sender<Result<watch::Receiver<Response>, anyhow::Error>>,
    ) {
    }
}

#[derive(Clone)]
pub struct Handle {
    handle_tx: mpsc::Sender<Message>,
}

impl Handle {
    pub async fn get_watcher(
        &self,
        tracker_type: TrackerType,
    ) -> Result<watch::Receiver<Response>, anyhow::Error> {
        let (tx, rx) = oneshot::channel();
        self.handle_tx
            .send(Message::GetWatcher(tracker_type, tx))
            .await?;
        rx.await?
    }

    pub async fn shutdown(&self) -> anyhow::Result<()> {
        let (tx, rx) = oneshot::channel();
        self.handle_tx.send(Message::Shutdown(tx)).await?;
        Ok(rx.await?)
    }
}
