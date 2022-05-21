use std::time::Duration;

use log::{debug, error, info};
use serde::{Deserialize, Serialize};
use tauri::{self, AppHandle, Manager};
use tokio::select;
use tokio::{
    sync::oneshot,
    time::{interval, MissedTickBehavior},
};

use hdt_mem_reader::manager::ManagerHandle;

use crate::state::State;

static TASK_STATE_MEMORY_UPDATER: &str = "task-state:MemoryUpdater";
static TASK_STATE_AUTO_FIXER: &str = "task-state:AutoFixer";
static TASK_STATE_WEB_SERVER: &str = "task-state:WebServer";

#[derive(Deserialize, Debug)]
#[serde(tag = "type")]
pub enum TaskStart {
    MemoryUpdater,
    AutoFixer,
    WebServer { port: u64 },
}

#[derive(Deserialize, Debug)]
#[serde(tag = "type")]
pub enum TaskEnd {
    MemoryUpdater,
    AutoFixer,
    WebServer,
}

#[derive(Serialize, Debug, Clone)]
#[serde(tag = "type")]
pub enum TaskState {
    Pending(String),
    Connected,
}

pub struct Tasks {
    pub memory_updater: Option<oneshot::Sender<()>>,
    pub auto_fixer: Option<oneshot::Sender<()>>,
    pub web_server: Option<oneshot::Sender<()>>,
}

#[tauri::command]
pub async fn start_task(
    task: TaskStart,
    state: tauri::State<'_, State>,
    app_handle: tauri::AppHandle,
) -> Result<(), String> {
    info!("Starting task {:?}", task);

    let mut tasks = state.tasks.lock().expect("Failed to get lock");

    let app_handle = app_handle.clone();
    let mem_manager = state.mem_manager.clone();

    match task {
        TaskStart::MemoryUpdater => {
            if tasks.memory_updater.is_none() {
                let (mut task, shutdown_tx) = MemoryUpdaterTask::new(mem_manager, app_handle);
                tauri::async_runtime::spawn(async move {
                    task.run().await;
                });
                tasks.memory_updater = Some(shutdown_tx);
            }
        }
        TaskStart::AutoFixer => {
            if tasks.auto_fixer.is_none() {
                let (mut task, shutdown_tx) = AutoFixerTask::new(mem_manager, app_handle);
                tauri::async_runtime::spawn(async move {
                    task.run().await;
                });
                tasks.auto_fixer = Some(shutdown_tx);
            }
        }
        TaskStart::WebServer { .. } => {
            if tasks.web_server.is_none() {
                let (mut task, shutdown_tx) = WebServerTask::new(mem_manager, app_handle);
                tauri::async_runtime::spawn(async move {
                    task.run().await;
                });
                tasks.web_server = Some(shutdown_tx);
            }
        }
    };

    Ok(())
}

#[tauri::command]
pub async fn stop_task(task: TaskEnd, state: tauri::State<'_, State>) -> Result<(), String> {
    info!("Stopping task {:?}", task);
    let mut tasks = state.tasks.lock().expect("Failed to get lock");

    match task {
        TaskEnd::MemoryUpdater => {
            if let Some(task) = tasks.memory_updater.take() {
                let _ = task.send(());
            }
        }
        TaskEnd::AutoFixer => {
            if let Some(task) = tasks.auto_fixer.take() {
                let _ = task.send(());
            }
        }
        TaskEnd::WebServer => {
            if let Some(task) = tasks.web_server.take() {
                let _ = task.send(());
            }
        }
    };

    Ok(())
}

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
        if let Err(err) = self
            .app_handle
            .emit_all(TASK_STATE_MEMORY_UPDATER, TaskState::Connected)
        {
            error!("Failed to notify window: {:?}", err);
        }
    }

    pub async fn run(&mut self) {
        debug!("MemoryUpdaterTask::run - start");
        let mut poll_interval = interval(Duration::from_secs(5));
        poll_interval.set_missed_tick_behavior(MissedTickBehavior::Delay);
        self.connected();

        loop {
            select! {
                _ = &mut self.shutdown_rx => {
                    break;
                }
                _now = poll_interval.tick() => {
                    info!("MemoryUpdaterTask::run - tick...")
                }
            }
        }

        debug!("MemoryUpdaterTask::run - end");
    }
}

pub struct AutoFixerTask {
    shutdown_rx: oneshot::Receiver<()>,
    memory_handle: ManagerHandle,
    app_handle: AppHandle,
}

impl AutoFixerTask {
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
        if let Err(err) = self
            .app_handle
            .emit_all(TASK_STATE_AUTO_FIXER, TaskState::Connected)
        {
            error!("Failed to notify window: {:?}", err);
        }
    }

    pub async fn run(&mut self) {
        debug!("AutoFixerTask::run - start");
        let mut poll_interval = interval(Duration::from_secs(5));
        poll_interval.set_missed_tick_behavior(MissedTickBehavior::Delay);
        self.connected();

        loop {
            select! {
                _ = &mut self.shutdown_rx => {
                    break;
                }
                _now = poll_interval.tick() => {
                    info!("AutoFixerTask::run - tick...")
                }
            }
        }

        debug!("AutoFixerTask::run - end");
    }
}

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
        if let Err(err) = self
            .app_handle
            .emit_all(TASK_STATE_WEB_SERVER, TaskState::Connected)
        {
            error!("Failed to notify window: {:?}", err);
        }
    }

    pub async fn run(&mut self) {
        debug!("WebServerTask::run - start");
        let mut poll_interval = interval(Duration::from_secs(5));
        poll_interval.set_missed_tick_behavior(MissedTickBehavior::Delay);
        self.connected();

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
