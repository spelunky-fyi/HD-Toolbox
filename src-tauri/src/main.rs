#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

//static SPELUNKY_ID: u32 = 239350;

#[tauri::command]
fn launch_spelunky_hd() -> Result<String, String> {
    println!("hi");
    open::that("steam://run/239350").map_err(|_| "Failed to launch!")?;
    Ok("Launched!".into())
}

fn main() -> anyhow::Result<()> {
    tauri::Builder::default()
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .invoke_handler(tauri::generate_handler![launch_spelunky_hd])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
    Ok(())
}
