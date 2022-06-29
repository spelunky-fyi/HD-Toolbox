pub mod auto_fixer;
pub mod category;
pub mod memory_updater;
pub mod pacifist;
pub mod tracker_task;
pub mod trackers;
pub mod web_server;

use log::info;
use serde::{Deserialize, Serialize};
use tauri::{self};

use tokio::sync::oneshot;

use hdt_mem_reader::manager::{PayloadRequest, PayloadResponse};

use crate::state::State;

#[derive(Deserialize, Debug)]
#[serde(tag = "type")]
pub enum TaskStart {
    MemoryUpdater,
    AutoFixer,
    WebServer { port: u16 },
}

#[derive(Deserialize, Debug)]
#[serde(tag = "type")]
pub enum TaskEnd {
    MemoryUpdater,
    AutoFixer,
    WebServer,
}

#[derive(Debug, Serialize, Clone, PartialEq, Eq)]
#[serde(tag = "type", content = "data")]
pub enum WebServerResponse {
    WebServer,
    Failure(String),
}

#[derive(Debug, Serialize, Clone)]
#[serde(tag = "type", content = "data")]
enum TaskUpdate {
    MemoryUpdater(PayloadResponse),
    AutoFixer(PayloadResponse),
    WebServer(WebServerResponse),
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

    match task {
        TaskStart::MemoryUpdater => {
            if tasks.memory_updater.is_none() {
                let mem_manager = state.mem_manager.clone();
                let (mut task, shutdown_tx) =
                    memory_updater::MemoryUpdaterTask::new(mem_manager, app_handle);
                tauri::async_runtime::spawn(async move {
                    task.run().await;
                });
                tasks.memory_updater = Some(shutdown_tx);
            }
        }
        TaskStart::AutoFixer => {
            if tasks.auto_fixer.is_none() {
                let mem_manager = state.mem_manager.clone();
                let (mut task, shutdown_tx) = auto_fixer::AutoFixerTask::new(
                    mem_manager,
                    app_handle,
                    state.autofix_config_watcher.clone(),
                );
                tauri::async_runtime::spawn(async move {
                    task.run().await;
                });
                tasks.auto_fixer = Some(shutdown_tx);
            }
        }
        TaskStart::WebServer { port } => {
            if tasks.web_server.is_none() {
                let tracker_manager = state.tracker_manager.clone();
                let (mut task, shutdown_tx) = web_server::WebServerTask::new(
                    tracker_manager,
                    app_handle,
                    state.tracker_resources.clone(),
                    port,
                );
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

#[tauri::command]
pub async fn fix_slowlook(state: tauri::State<'_, State>) -> Result<(), String> {
    let mem_manager = state.mem_manager.clone();
    mem_manager
        .get_payload(PayloadRequest::FixSlowLook)
        .await
        .map_err(|err| format!("{:?}", err))?;
    Ok(())
}

#[tauri::command]
pub async fn set_character(
    index: usize,
    value: u32,
    state: tauri::State<'_, State>,
) -> Result<(), String> {
    let mem_manager = state.mem_manager.clone();
    mem_manager
        .get_payload(PayloadRequest::SetCharacter(index, value))
        .await
        .map_err(|err| format!("{:?}", err))?;
    Ok(())
}
