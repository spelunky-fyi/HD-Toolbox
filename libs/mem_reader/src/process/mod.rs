#[cfg(target_os = "windows")]
mod win;
#[cfg(target_os = "windows")]
pub use win::*;

#[cfg(not(target_os = "windows"))]
mod mock;
#[cfg(not(target_os = "windows"))]
pub use mock::*;

use thiserror::Error;

#[derive(Error, Debug, Clone)]
pub enum Failure {
    #[error("Failed to open process.")]
    OpenProcessFailed(#[from] OpenProcessError),

    #[error("Failed to read memory.")]
    ReadMemoryError(#[from] ReadMemoryError),
}

#[derive(Error, Debug, Clone)]
pub enum FindProcessError {
    #[error("No Spelunky.exe process found.")]
    NoProcessFound,

    #[error("Multiple Spelunky.exe processes found.")]
    MultipleProcessesFound,

    #[error("Failed to lookup process: {0}")]
    Unknown(String),
}

#[derive(Debug)]
pub enum Version {
    Spelunky14,
    Spelunky147,
}

#[derive(Error, Debug, Clone)]
pub enum OpenProcessError {
    #[error("Failed to find process.")]
    FindProcessFailed(#[from] FindProcessError),

    #[error("Failed to acquire process handle.")]
    OpenProcessFailed,

    #[error("Failed to locate base address: {0}")]
    LocateBaseAddrFailed(String),

    #[error("Process doesn't match any known version of Spelunky HD")]
    UnknownVersion,

    #[error("Failed to lookup process: {0}")]
    Unknown(String),
}

#[derive(Error, Debug, Clone)]
pub enum ReadMemoryError {
    #[error("Failed to read memory.")]
    Failed,

    #[error("Read less memory than expected.")]
    ShortRead,
}
