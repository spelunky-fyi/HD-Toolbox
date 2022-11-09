use std::collections::hash_map::Entry;
use std::collections::HashMap;
use std::time::Duration;

use hdt_mem_reader::manager::ManagerHandle;
use log::{debug, error};
use serde::Serialize;
use serde_json::Value as JsonValue;
use tokio::select;
use tokio::sync::{mpsc, oneshot, watch};
use tokio::time::interval;
use tokio::time::MissedTickBehavior;

use super::category::{CategoryResponse, CategoryTracker};
use super::pacifist::{PacifistResponse, PacifistTracker};
use super::session::{SessionResponse, SessionTracker};
use super::tracker_task::{TrackerTask, TrackerTaskHandle};

#[derive(Debug, Serialize, Clone, PartialEq, Eq)]
#[serde(tag = "type", content = "data")]
pub enum Response {
    Category(CategoryResponse),
    Session(SessionResponse),
    Pacifist(PacifistResponse),
    Failure(String),
    Empty,
}

#[derive(Debug, PartialEq, Eq, Hash, Clone, Copy)]
pub enum TrackerType {
    Category,
    Session,
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

    tasks: HashMap<TrackerType, TrackerTaskHandle>,

    configs: HashMap<TrackerType, watch::Receiver<HashMap<String, JsonValue>>>,
}

impl TrackerManager {
    pub fn new(
        memory_manager: ManagerHandle,
        configs: HashMap<TrackerType, watch::Receiver<HashMap<String, JsonValue>>>,
    ) -> Self {
        let (handle_tx, handle_rx) = mpsc::channel::<Message>(100);
        Self {
            handle_tx,
            handle_rx,
            shutdown_tx: None,
            memory_manager,
            tasks: HashMap::new(),
            configs: configs,
        }
    }

    pub async fn run_in_background(
        memory_manager: ManagerHandle,
        configs: HashMap<TrackerType, watch::Receiver<HashMap<String, JsonValue>>>,
    ) -> Handle {
        debug!("Spawning thread for Tracker Manager");
        let (tx, rx) = oneshot::channel::<Handle>();
        tauri::async_runtime::spawn(async move {
            let mut manager = TrackerManager::new(memory_manager, configs);
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
                    let mut to_remove = vec![];
                    for (task_type, task) in &self.tasks {
                        match task.is_stale().await {
                            Ok(is_stale) => {
                                if is_stale {
                                    to_remove.push(*task_type);
                                    task.shutdown().await.ok();
                                }
                            },
                            Err(err) => {
                                error!("Task went away: {:?}", err);
                                to_remove.push(*task_type);
                            }
                        }
                    }

                    for task_type in to_remove {
                        self.tasks.remove(&task_type);
                    }
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
                self.handle_get_watcher(tracker_type, response).await;
            }
        };
    }

    fn handle_shutdown(&mut self, response: oneshot::Sender<()>) {
        if let Some(tx) = self.shutdown_tx.take() {
            let _ = tx.send(());
        }
        let _ = response.send(());
    }

    async fn handle_get_watcher(
        &mut self,
        tracker_type: TrackerType,
        response: oneshot::Sender<Result<watch::Receiver<Response>, anyhow::Error>>,
    ) {
        let entry = match self.tasks.entry(tracker_type) {
            Entry::Occupied(entry) => {
                let watcher = entry.get().subscribe().await;
                response.send(watcher).ok();
                return;
            }
            Entry::Vacant(entry) => entry,
        };

        let config = self
            .configs
            .get(&tracker_type)
            .map(|c| c.clone())
            .expect("No config found.");

        let mut task = TrackerTask::new(config);
        let handle = task.get_handle();
        let mem_manager = self.memory_manager.clone();
        match tracker_type {
            TrackerType::Pacifist => {
                tauri::async_runtime::spawn(async move {
                    let tracker = PacifistTracker::new(mem_manager);
                    task.run(tracker).await;
                });
            }
            TrackerType::Category => {
                tauri::async_runtime::spawn(async move {
                    let tracker = CategoryTracker::new(mem_manager);
                    task.run(tracker).await;
                });
            }
            TrackerType::Session => {
                tauri::async_runtime::spawn(async move {
                    let tracker = SessionTracker::new(mem_manager);
                    task.run(tracker).await;
                });
            }
        }
        let watcher = handle.subscribe().await;
        entry.insert(handle);
        response.send(watcher).ok();
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
