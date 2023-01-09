#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod config;
mod state;
mod tasks;

use std::path::PathBuf;
use std::{collections::HashMap, thread};

use log::{debug, warn, LevelFilter};
use tasks::trackers::{TrackerManager, TrackerType};
use tauri::{Manager, WindowEvent};
use tauri_plugin_log::LoggerBuilder;
use tauri_plugin_store::StoreBuilder;
use tokio::{runtime, sync::oneshot};

use hdt_mem_reader::manager::ManagerHandle;

#[cfg(debug_assertions)]
static LOG_LEVEL: LevelFilter = log::LevelFilter::Debug;

#[cfg(not(debug_assertions))]
static LOG_LEVEL: LevelFilter = log::LevelFilter::Info;

static MAIN_CONFIG: &str = "hd-toolbox.config";

#[tauri::command]
fn launch_spelunky_hd() -> Result<String, String> {
    open::that("steam://run/239350").map_err(|_| "Failed to launch!")?;
    Ok("Launched!".into())
}

#[tauri::command]
fn inject_specs(dll: String) -> Result<(), String> {
    debug!("Injecting DLL: {}", dll);
    // Nothing consumes this result. We just use it for short-circuiting.
    thread::spawn(move || -> anyhow::Result<()> {
        let path = PathBuf::from(dll);

        let mut process = hdt_mem_reader::process::Process::new().map_err(|err| {
            warn!("Failed to find process: {}", err);
            err
        })?;

        process.inject_dll(&path).map_err(|err| {
            warn!("Failed to inject dll: {}", err);
            err
        })?;
        Ok(())
    });

    Ok(())
}

#[tauri::command]
fn launch_frozlunky(app_handle: tauri::AppHandle, exe: String) -> Result<(), String> {
    debug!("Launching: {}", exe);
    tauri::api::shell::open(&app_handle.shell_scope(), exe, None)
        .map_err(|err| format!("{:?}", err))?;
    Ok(())
}

async fn run_mem_manager() -> ManagerHandle {
    debug!("Spawning thread for Memory Manager");
    let (tx, rx) = oneshot::channel::<ManagerHandle>();
    thread::spawn(move || {
        let basic_rt = runtime::Builder::new_current_thread()
            .enable_all()
            .build()
            .unwrap();
        basic_rt.block_on(async {
            let mut manager = hdt_mem_reader::manager::Manager::new();
            let handle = manager.get_handle();
            let _ = tx.send(handle);

            manager.run_forever().await;
        })
    });
    rx.await.expect("Failed to run Memory Manger")
}

fn main() -> anyhow::Result<()> {
    // Setup various config stores
    let main_config = StoreBuilder::new(MAIN_CONFIG.parse()?).build();
    let specs_config = StoreBuilder::new("specs.config".parse()?).build();
    let frozlunky_config = StoreBuilder::new("frozlunky.config".parse()?).build();
    let mut music_engine_config = StoreBuilder::new("music-engine.config".parse()?).build();
    let music_engine_config_watcher = music_engine_config.get_watcher();

    let mut autofix_config = StoreBuilder::new("auto-fixer.config".parse()?).build();
    let autofix_config_watcher = autofix_config.get_watcher();

    let mut tracker_pacifist_config = StoreBuilder::new("tracker-pacifist.config".parse()?).build();
    let mut tracker_category_config = StoreBuilder::new("tracker-category.config".parse()?).build();
    let mut tracker_session_config = StoreBuilder::new("tracker-session.config".parse()?).build();
    let mut tracker_configs = HashMap::new();
    tracker_configs.insert(TrackerType::Pacifist, tracker_pacifist_config.get_watcher());
    tracker_configs.insert(TrackerType::Category, tracker_category_config.get_watcher());
    tracker_configs.insert(TrackerType::Session, tracker_session_config.get_watcher());

    let log_plugin = LoggerBuilder::new()
        .level_for("attohttpc", log::LevelFilter::Warn)
        .level_for("mio::poll", log::LevelFilter::Warn)
        .level_for("tungstenite::protocol", log::LevelFilter::Warn)
        .level_for("goblin::pe", log::LevelFilter::Warn)
        .level(LOG_LEVEL)
        .build();

    tauri::Builder::default()
        .plugin(log_plugin)
        .plugin(
            tauri_plugin_store::PluginBuilder::default()
                .stores([
                    main_config,
                    tracker_pacifist_config,
                    tracker_category_config,
                    tracker_session_config,
                    specs_config,
                    frozlunky_config,
                    music_engine_config,
                    autofix_config,
                ])
                .freeze()
                .build(),
        )
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .setup(|app| {
            let handle = app.handle();
            let main = app.get_window("main").expect("Failed to get main window.");
            main.on_window_event(move |event| {
                if let WindowEvent::CloseRequested { api, .. } = event {
                    api.prevent_close();

                    let handle = handle.clone();
                    tauri::async_runtime::spawn(async move {
                        let state = handle.state::<state::State>();
                        state.tracker_manager.shutdown().await.ok();
                        state.mem_manager.shutdown().await.ok();

                        let mut main = None;
                        for (window_name, window) in handle.windows() {
                            if window_name == "main" {
                                main = Some(window);
                                continue;
                            }
                            debug!("Closing {}", window_name);
                            window.close().ok();
                        }

                        if let Some(main) = main {
                            main.close().ok();
                        }
                    });
                }
            });

            let handle = app.handle();
            tauri::async_runtime::spawn(async move {
                let memory_manager = run_mem_manager().await;
                let tracker_manager =
                    TrackerManager::run_in_background(memory_manager.clone(), tracker_configs)
                        .await;
                handle.manage(state::State::new(
                    memory_manager,
                    tracker_manager,
                    autofix_config_watcher,
                    music_engine_config_watcher,
                ));
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            launch_spelunky_hd,
            inject_specs,
            launch_frozlunky,
            tasks::start_task,
            tasks::stop_task,
            tasks::fix_slowlook,
            tasks::set_character,
        ])
        .build(tauri::generate_context!())
        .expect("error while running tauri application")
        .run(|_app, _event| {});
    Ok(())
}
