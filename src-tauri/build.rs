use std::io;

use static_files::resource_dir;

fn main() -> io::Result<()> {
    resource_dir("../trackers").build()?;
    tauri_build::build();
    println!("cargo:rerun-if-changed=../trackers");
    Ok(())
}
