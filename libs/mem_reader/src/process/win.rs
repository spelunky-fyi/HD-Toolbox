use std::ffi::CString;
use std::intrinsics::transmute;
use std::mem::size_of;
use std::path::PathBuf;

use byteorder::ByteOrder;
use byteorder::LittleEndian;
use goblin::pe::PE;
use widestring::U16Str;
use winapi::shared::minwindef::LPDWORD;
use winapi::shared::minwindef::{DWORD, HMODULE, LPCVOID, LPVOID, MAX_PATH};
use winapi::um::handleapi::{CloseHandle, INVALID_HANDLE_VALUE};
use winapi::um::memoryapi::ReadProcessMemory;
use winapi::um::memoryapi::VirtualAllocEx;
use winapi::um::memoryapi::WriteProcessMemory;
use winapi::um::minwinbase::LPTHREAD_START_ROUTINE;
use winapi::um::minwinbase::PSECURITY_ATTRIBUTES;
use winapi::um::minwinbase::STILL_ACTIVE;
use winapi::um::processthreadsapi::CreateRemoteThread;
use winapi::um::processthreadsapi::{GetExitCodeProcess, OpenProcess};
use winapi::um::psapi::EnumProcessModulesEx;
use winapi::um::psapi::LIST_MODULES_32BIT;
use winapi::um::psapi::{EnumProcessModules, GetModuleFileNameExA};
use winapi::um::synchapi::WaitForSingleObject;
use winapi::um::tlhelp32::{
    CreateToolhelp32Snapshot, Process32First, Process32Next, PROCESSENTRY32, TH32CS_SNAPPROCESS,
};
use winapi::um::winbase::INFINITE;
use winapi::um::winnt::HANDLE;
use winapi::um::winnt::MEM_COMMIT;
use winapi::um::winnt::MEM_RESERVE;
use winapi::um::winnt::PAGE_EXECUTE_READWRITE;
use winapi::um::winnt::PROCESS_CREATE_THREAD;
use winapi::um::winnt::PROCESS_VM_OPERATION;
use winapi::um::winnt::PROCESS_VM_WRITE;
use winapi::um::winnt::{PROCESS_QUERY_INFORMATION, PROCESS_VM_READ};
use winapi::um::wow64apiset::GetSystemWow64DirectoryW;

use crate::constants::{self, Offsets};
use crate::process::{FindProcessError, OpenProcessError, ReadMemoryError, Version};

use super::Failure;
use super::InjectDllError;
use super::WriteMemoryError;

pub struct Process {
    handle: HANDLE,
    pub base_addr: usize,
    pub version: Version,
    pub offsets: &'static Offsets,
}

impl Process {
    pub fn new() -> Result<Self, OpenProcessError> {
        let pid = Self::get_spelunky_hd_pid()?;
        let process_handle: HANDLE = unsafe {
            OpenProcess(
                PROCESS_QUERY_INFORMATION
                    | PROCESS_VM_READ
                    | PROCESS_VM_WRITE
                    | PROCESS_VM_OPERATION
                    | PROCESS_CREATE_THREAD,
                0,
                pid,
            )
        };

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

    pub fn traverse_offset(
        &self,
        addr: usize,
        offsets: &[usize],
    ) -> Result<usize, ReadMemoryError> {
        let mut result = addr;
        for offset in offsets {
            result = self.read_u32(result + offset)? as usize;
        }
        Ok(result)
    }

    pub fn read_n_bytes(&self, addr: usize, num_bytes: usize) -> Result<Vec<u8>, ReadMemoryError> {
        read_n_bytes(self.handle, addr, num_bytes)
    }

    pub fn write_n_bytes(&self, addr: usize, bytes: Vec<u8>) -> Result<usize, WriteMemoryError> {
        write_n_bytes(self.handle, addr, bytes)
    }

    pub fn read_u32(&self, addr: usize) -> Result<u32, ReadMemoryError> {
        Ok(LittleEndian::read_u32(&self.read_n_bytes(addr, 4)?))
    }

    pub fn read_i32(&self, addr: usize) -> Result<i32, ReadMemoryError> {
        Ok(LittleEndian::read_i32(&self.read_n_bytes(addr, 4)?))
    }

    pub fn read_f64(&self, addr: usize) -> Result<f64, ReadMemoryError> {
        Ok(LittleEndian::read_f64(&self.read_n_bytes(addr, 8)?))
    }

    pub fn read_u8(&self, addr: usize) -> Result<u8, ReadMemoryError> {
        Ok(self.read_n_bytes(addr, 1)?[0])
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

    fn get_spelunky_hd_pid() -> Result<u32, FindProcessError> {
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
            let process_name = win_bytes_to_string(&process.szExeFile);
            if process_name == "Spelunky.exe" {
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
        let process_image_string = win_bytes_to_string(&process_image_filename).to_lowercase();

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

            let module_string = win_bytes_to_string(&module_filename).to_lowercase();
            if module_string != process_image_string {
                continue;
            }

            // Found the exe module base address
            return Ok(module_handles[idx] as usize);
        }

        Err(OpenProcessError::LocateBaseAddrFailed(
            "Failed to find module...".into(),
        ))
    }

    fn get_kernel32_addr(&self) -> Result<usize, InjectDllError> {
        // Get handles for all modules in process.
        let mut module_handles: [HMODULE; 1024] = [0 as HMODULE; 1024];
        let hmodule_size: usize = size_of::<HMODULE>()
            .try_into()
            .expect("Failed to get size of HMODULE");
        let mut bytes_written = 0;

        let result = unsafe {
            EnumProcessModulesEx(
                self.handle,
                module_handles.as_mut_ptr(),
                size_of::<[HMODULE; 1024]>()
                    .try_into()
                    .expect("Failed to get size for modules"),
                &mut bytes_written,
                LIST_MODULES_32BIT,
            )
        };

        if result == 0 {
            return Err(InjectDllError::CantFindKernel32);
        }

        let num_modules = bytes_written as usize / hmodule_size;

        // Enumerate Modules to find handle for EXE module
        for idx in 0..num_modules {
            let mut module_filename = [0; MAX_PATH];

            let result = unsafe {
                GetModuleFileNameExA(
                    self.handle,
                    module_handles[idx],
                    module_filename.as_mut_ptr(),
                    MAX_PATH as u32,
                )
            };

            if result == 0 {
                continue;
            }

            let name: String = String::from_utf8_lossy(
                &module_filename
                    .map(|c| c as u8)
                    .into_iter()
                    .take_while(|c| *c != 0)
                    .collect::<Vec<u8>>(),
            )
            .to_lowercase();

            if !name.ends_with("\\kernel32.dll") {
                continue;
            }

            // Found the exe module base address
            return Ok(module_handles[idx] as usize);
        }

        Err(InjectDllError::CantFindKernel32)
    }

    fn get_load_library(&self) -> Result<LPTHREAD_START_ROUTINE, InjectDllError> {
        let kernel32 = self.get_kernel32_addr()?;
        let load_library_rva = get_load_library_rva().map_err(|_| InjectDllError::Failed)?;
        Ok(unsafe { transmute(kernel32 + load_library_rva) })
    }

    fn alloc(&mut self, size: usize) -> Result<usize, WriteMemoryError> {
        let addr = unsafe {
            VirtualAllocEx(
                self.handle,
                winapi::shared::ntdef::NULL,
                size,
                MEM_RESERVE | MEM_COMMIT,
                PAGE_EXECUTE_READWRITE,
            )
        };

        if addr == winapi::shared::ntdef::NULL {
            return Err(WriteMemoryError::Failed);
        }

        Ok(addr as usize)
    }

    pub fn inject_dll(&mut self, dll_path: &PathBuf) -> Result<(), Failure> {
        let dll = CString::new(dll_path.to_string_lossy().as_bytes())
            .map_err(|_| InjectDllError::Failed)?;
        let dll_path_with_bytes = dll.as_bytes_with_nul();

        let addr = self.alloc(dll_path_with_bytes.len())?;
        self.write_n_bytes(addr, dll_path_with_bytes.to_vec())?;

        let load_library_addr = self.get_load_library()?;

        let handle = unsafe {
            CreateRemoteThread(
                self.handle,
                winapi::shared::ntdef::NULL as PSECURITY_ATTRIBUTES,
                0,
                load_library_addr,
                addr as LPVOID,
                0,
                winapi::shared::ntdef::NULL as LPDWORD,
            )
        };
        let _wait_result = unsafe { WaitForSingleObject(handle, INFINITE) };

        Ok(())
    }
}

impl Drop for Process {
    fn drop(&mut self) {
        unsafe {
            CloseHandle(self.handle);
        };
    }
}

fn win_bytes_to_string(bytes: &[i8]) -> String {
    let process_bytes: Vec<u8> = bytes
        .iter()
        .map(|c| *c as u8)
        .take_while(|c| *c != 0)
        .collect();
    String::from_utf8_lossy(&process_bytes).into()
}

fn get_load_library_rva() -> Result<usize, InjectDllError> {
    let mut wow64_path = [0; MAX_PATH];
    let result = unsafe { GetSystemWow64DirectoryW(wow64_path.as_mut_ptr(), MAX_PATH as u32) };

    if result == 0 {
        return Err(InjectDllError::CantFindLoadLibraryA);
    }

    let mut kernel32_path =
        PathBuf::from(U16Str::from_slice(&wow64_path[..result as usize]).to_os_string());
    kernel32_path.push("kernel32.dll");

    // load the dll as a pe and extract the fn offsets
    let module_file_buffer =
        std::fs::read(kernel32_path).map_err(|_| InjectDllError::CantFindLoadLibraryA)?;
    let pe = PE::parse(&module_file_buffer).map_err(|_| InjectDllError::CantFindLoadLibraryA)?;
    let load_library_export = pe
        .exports
        .iter()
        .find(|export| matches!(export.name, Some("LoadLibraryA")))
        .ok_or(InjectDllError::CantFindLoadLibraryA)?;

    Ok(load_library_export.rva)
}

pub fn read_n_bytes(
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

pub fn write_n_bytes(
    process: HANDLE,
    addr: usize,
    data: Vec<u8>,
) -> Result<usize, WriteMemoryError> {
    let mut bytes_written = 0;
    let num_bytes = data.len();

    if unsafe {
        WriteProcessMemory(
            process,
            addr as LPVOID,
            data.as_ptr() as LPCVOID,
            num_bytes,
            &mut bytes_written,
        )
    } == 0
    {
        return Err(WriteMemoryError::Failed);
    }

    if num_bytes != bytes_written {
        return Err(WriteMemoryError::ShortWrite);
    }

    Ok(bytes_written)
}
