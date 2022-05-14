use super::{OpenProcessError, Version};
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

    pub fn still_active(&self) -> bool {
        true
    }
}
