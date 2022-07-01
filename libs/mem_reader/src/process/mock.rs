use std::path::PathBuf;

use byteorder::ByteOrder;
use byteorder::LittleEndian;

use super::Failure;
use super::{OpenProcessError, ReadMemoryError, Version, WriteMemoryError};
use crate::constants::{Offsets, EXE_NAME, KALI_ACCEPTS};

pub struct Process {
    pub base_addr: usize,
    pub version: Version,
    pub offsets: &'static Offsets,
}

impl Process {
    pub fn new() -> Result<Self, OpenProcessError> {
        // Shut up constants about not being used when not on windows.
        let _ = KALI_ACCEPTS;
        let _ = EXE_NAME;
        return Ok(Process {
            base_addr: 0,
            version: Version::Spelunky147,
            offsets: Offsets::get_offsets_by_version(&Version::Spelunky147),
        });
    }

    pub fn read_n_bytes(&self, _addr: usize, num_bytes: usize) -> Result<Vec<u8>, ReadMemoryError> {
        Ok(vec![0; num_bytes])
    }

    pub fn write_n_bytes(&self, _addr: usize, bytes: Vec<u8>) -> Result<usize, WriteMemoryError> {
        Ok(bytes.len())
    }

    pub fn read_f64(&self, addr: usize) -> Result<f64, ReadMemoryError> {
        Ok(LittleEndian::read_f64(&self.read_n_bytes(addr, 8)?))
    }

    pub fn read_i32(&self, addr: usize) -> Result<i32, ReadMemoryError> {
        Ok(LittleEndian::read_i32(&self.read_n_bytes(addr, 4)?))
    }

    pub fn read_u32(&self, addr: usize) -> Result<u32, ReadMemoryError> {
        Ok(LittleEndian::read_u32(&self.read_n_bytes(addr, 4)?))
    }

    pub fn read_u8(&self, _addr: usize) -> Result<u8, ReadMemoryError> {
        Ok(0)
    }

    pub fn still_active(&self) -> bool {
        true
    }

    pub fn inject_dll(&mut self, _dll_path: &PathBuf) -> Result<(), Failure> {
        Ok(())
    }
}
