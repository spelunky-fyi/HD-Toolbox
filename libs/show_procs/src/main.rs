use std::mem::size_of;

use anyhow::anyhow;
use winapi::shared::minwindef::MAX_PATH;
use winapi::um::handleapi::{CloseHandle, INVALID_HANDLE_VALUE};
use winapi::um::tlhelp32::{
    CreateToolhelp32Snapshot, Process32First, Process32Next, PROCESSENTRY32, TH32CS_SNAPPROCESS,
};

fn get_lunky_procs() -> Result<Vec<String>, anyhow::Error> {
    let mut procs = vec![];

    let process_snap = unsafe { CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0) };

    if process_snap == INVALID_HANDLE_VALUE {
        return Err(anyhow!("Failed to get process snapshot."));
    }

    let process_entry_size: u32 = size_of::<PROCESSENTRY32>()
        .try_into()
        .map_err(|_| anyhow!("Failed to get size of ProcessEntry32"))?;

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
        return Err(anyhow!("Failed to get first process..."));
    }

    loop {
        let process_bytes: Vec<u8> = process
            .szExeFile
            .map(|c| c as u8)
            .iter()
            .take_while(|c| **c != 0)
            .cloned()
            .collect();

        let process_name: String = String::from_utf8_lossy(&process_bytes).into();

        if process_name.to_lowercase().contains("spelunky") {
            procs.push(process_name.into());
        }

        if unsafe { Process32Next(process_snap, &mut process) } == 0 {
            break;
        }
    }

    unsafe { CloseHandle(process_snap) };

    Ok(procs)
}

fn main() {
    loop {
        match ::hdt_mem_reader::process::Process::new() {
            Ok(process) => {
                println!("Process opened!");
                drop(process);
            }
            Err(err) => eprintln!("Failed to open process: {}", err),
        }
        println!("==============");
        ::std::thread::sleep(std::time::Duration::from_secs(5));
    }
}
