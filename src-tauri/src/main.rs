#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use log::LevelFilter;
use tauri_plugin_log::LoggerBuilder;
use tauri_plugin_store::StoreBuilder;

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

fn main() -> anyhow::Result<()> {
    let main_config = StoreBuilder::new(MAIN_CONFIG.parse()?).build();

    tauri::Builder::default()
        .plugin(
            LoggerBuilder::new()
                .level_for("attohttpc", log::LevelFilter::Warn)
                .level_for("mio::poll", log::LevelFilter::Warn)
                .level(LOG_LEVEL)
                .build(),
        )
        .plugin(
            tauri_plugin_store::PluginBuilder::default()
                .stores([main_config])
                .freeze()
                .build(),
        )
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .invoke_handler(tauri::generate_handler![launch_spelunky_hd,])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
    Ok(())
}
