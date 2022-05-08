use std::mem::size_of;

use thiserror::Error;
use winapi::shared::minwindef::{DWORD, HMODULE, LPCVOID, LPVOID, MAX_PATH};
use winapi::um::handleapi::{CloseHandle, INVALID_HANDLE_VALUE};
use winapi::um::memoryapi::ReadProcessMemory;
use winapi::um::minwinbase::STILL_ACTIVE;
use winapi::um::processthreadsapi::{GetExitCodeProcess, OpenProcess};
use winapi::um::psapi::{EnumProcessModules, GetModuleFileNameExA};
use winapi::um::tlhelp32::{
    CreateToolhelp32Snapshot, Process32First, Process32Next, PROCESSENTRY32, TH32CS_SNAPPROCESS,
};
use winapi::um::winnt::HANDLE;
use winapi::um::winnt::{PROCESS_QUERY_INFORMATION, PROCESS_VM_READ};

use crate::constants::{self, Offsets, EXE_NAME};

#[derive(Error, Debug)]
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

#[derive(Error, Debug)]
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

pub struct Process {
    handle: HANDLE,
    pub base_addr: usize,
    pub version: Version,
    pub offsets: &'static Offsets,
}

impl Process {
    pub fn new() -> Result<Self, OpenProcessError> {
        let pid = Self::get_spelunky_hd_pid()?;
        let process_handle: HANDLE =
            unsafe { OpenProcess(PROCESS_QUERY_INFORMATION | PROCESS_VM_READ, 0, pid) };

        if process_handle == winapi::shared::ntdef::NULL {
            return Err(OpenProcessError::OpenProcessFailed);
        }

        let base_addr = match Self::get_base_addr(process_handle) {
            Ok(base_addr) => base_addr,
            Err(err) => {
                unsafe {
                    CloseHandle(process_handle);
                    return Err(err);
                };
            }
        };
        let version = match Self::get_version(process_handle, base_addr) {
            Ok(version) => version,
            Err(err) => {
                unsafe {
                    CloseHandle(process_handle);
                    return Err(err);
                };
            }
        };
        let offsets = Offsets::get_offsets_by_version(&version);

        return Ok(Process {
            handle: process_handle,
            base_addr,
            version,
            offsets,
        });
    }

    fn get_version(process: HANDLE, base_addr: usize) -> Result<Version, OpenProcessError> {
        if let Ok(bytes) = read_n_bytes(
            process,
            base_addr + constants::SPELUNKY_1_47_OFFSETS.kali_accepts,
            26,
        ) {
            if &bytes == constants::KALI_ACCEPTS {
                return Ok(Version::Spelunky147);
            }
        }

        if let Ok(bytes) = read_n_bytes(
            process,
            base_addr + constants::SPELUNKY_1_4_OFFSETS.kali_accepts,
            26,
        ) {
            if &bytes == constants::KALI_ACCEPTS {
                return Ok(Version::Spelunky14);
            }
        }

        Err(OpenProcessError::UnknownVersion)
    }

    pub fn still_active(&self) -> bool {
        let mut exit_code: DWORD = 0;
        unsafe { GetExitCodeProcess(self.handle, &mut exit_code) };
        exit_code == STILL_ACTIVE
    }

    pub fn get_spelunky_hd_pid() -> Result<u32, FindProcessError> {
        let mut pid = None;

        let process_snap = unsafe { CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0) };

        if process_snap == INVALID_HANDLE_VALUE {
            return Err(FindProcessError::Unknown(
                "Failed to get process snapshot.".into(),
            ));
        }

        let process_entry_size: u32 = size_of::<PROCESSENTRY32>().try_into().map_err(|_| {
            FindProcessError::Unknown("Failed to get size of ProcessEntry32".into())
        })?;

        let mut process: PROCESSENTRY32 = PROCESSENTRY32 {
            dwSize: process_entry_size,
            cntUsage: 0,
            th32ProcessID: 0,
            th32DefaultHeapID: 0,
            th32ModuleID: 0,
            cntThreads: 0,
            th32ParentProcessID: 0,
            pcPriClassBase: 0,
            dwFlags: 0,
            szExeFile: [0; MAX_PATH],
        };

        if unsafe { Process32First(process_snap, &mut process) } == 0 {
            return Err(FindProcessError::Unknown(
                "Failed to get first process...".into(),
            ));
        }

        loop {
            if &process.szExeFile[..EXE_NAME.len()] == EXE_NAME {
                if pid.is_some() {
                    unsafe { CloseHandle(process_snap) };
                    return Err(FindProcessError::MultipleProcessesFound);
                }

                pid = Some(process.th32ProcessID);
            }

            if unsafe { Process32Next(process_snap, &mut process) } == 0 {
                break;
            }
        }

        unsafe { CloseHandle(process_snap) };
        match pid {
            Some(pid) => Ok(pid),
            None => Err(FindProcessError::NoProcessFound),
        }
    }

    fn get_base_addr(process: HANDLE) -> Result<usize, OpenProcessError> {
        // Get Module name of EXE
        let mut process_image_filename = [0; MAX_PATH];

        let result = unsafe {
            GetModuleFileNameExA(
                process,
                0 as HMODULE,
                process_image_filename.as_mut_ptr(),
                MAX_PATH as u32,
            )
        };
        if result == 0 {
            return Err(OpenProcessError::LocateBaseAddrFailed(
                "Failed to get process module name...".into(),
            ));
        }

        // Get handles for all modules in process.
        let mut module_handles: [HMODULE; 1024] = [0 as HMODULE; 1024];
        let hmodule_size: usize = size_of::<HMODULE>()
            .try_into()
            .expect("Failed to get size of HMODULE");
        let mut bytes_written = 0;

        let result = unsafe {
            EnumProcessModules(
                process,
                module_handles.as_mut_ptr(),
                size_of::<[HMODULE; 1024]>()
                    .try_into()
                    .expect("Failed to get size for modules"),
                &mut bytes_written,
            )
        };

        if result == 0 {
            return Err(OpenProcessError::LocateBaseAddrFailed(
                "Failed to enumerate process modules...".into(),
            ));
        }

        let num_modules = bytes_written as usize / hmodule_size;

        // Enumerate Modules to find handle for EXE module
        for idx in 0..num_modules {
            let mut module_filename = [0; MAX_PATH];

            let result = unsafe {
                GetModuleFileNameExA(
                    process,
                    module_handles[idx],
                    module_filename.as_mut_ptr(),
                    MAX_PATH as u32,
                )
            };

            if result == 0 {
                continue;
            }

            if module_filename != process_image_filename {
                continue;
            }

            // Found the exe module base address
            return Ok(module_handles[idx] as usize);
        }

        Err(OpenProcessError::LocateBaseAddrFailed(
            "Failed to find module...".into(),
        ))
    }
}

impl Drop for Process {
    fn drop(&mut self) {
        unsafe {
            CloseHandle(self.handle);
        };
    }
}

#[derive(Error, Debug)]
pub enum ReadMemoryError {
    #[error("Failed to read memory.")]
    Failed,

    #[error("Read less memory than expected.")]
    ShortRead,
}

pub(crate) fn read_n_bytes(
    process: HANDLE,
    addr: usize,
    num_bytes: usize,
) -> Result<Vec<u8>, ReadMemoryError> {
    let mut buf: Vec<u8> = Vec::with_capacity(num_bytes);
    let mut bytes_read = 0;

    if unsafe {
        ReadProcessMemory(
            process,
            addr as LPCVOID,
            buf.as_mut_ptr() as LPVOID,
            num_bytes,
            &mut bytes_read,
        )
    } == 0
    {
        return Err(ReadMemoryError::Failed);
    }

    if num_bytes != bytes_read {
        return Err(ReadMemoryError::ShortRead);
    }

    unsafe { buf.set_len(bytes_read) };

    Ok(buf)
}
