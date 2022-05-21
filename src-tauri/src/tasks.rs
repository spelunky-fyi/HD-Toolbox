use std::time::Duration;

use log::{debug, error, info};
use serde::{Deserialize, Serialize};
use tauri::{self, Manager};

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
pub enum Task {
    MemoryUpdater,
    AutoFixer,
    WebServer,
}

#[derive(Serialize, Debug, Clone)]
#[serde(tag = "type")]
enum TaskState {
    Pending(String),
    Connected,
}

#[tauri::command]
pub async fn start_task(
    task: TaskStart,
    state: tauri::State<'_, State>,
    app_handle: tauri::AppHandle,
) -> Result<(), String> {
    info!("Starting task {:?}", task);
    tauri::async_runtime::spawn(async move {
        tokio::time::sleep(Duration::from_secs(2)).await;
        let event_name = match task {
            TaskStart::MemoryUpdater => TASK_STATE_MEMORY_UPDATER,
            TaskStart::AutoFixer => TASK_STATE_AUTO_FIXER,
            TaskStart::WebServer { .. } => TASK_STATE_WEB_SERVER,
        };
        if let Err(err) = app_handle.emit_all(event_name, TaskState::Connected) {
            error!("Failed to notify window: {:?}", err);
        }
    });
    Ok(())
}

#[tauri::command]
pub async fn stop_task(task: Task, state: tauri::State<'_, State>) -> Result<(), String> {
    info!("Stopping task {:?}", task);
    Ok(())
}
