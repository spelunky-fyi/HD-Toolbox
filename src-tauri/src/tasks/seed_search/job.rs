//! Keeps hd-seed-search from outliving the Toolbox. Stopping a search kills
//! it, but if the Toolbox is closed some other way (it crashes or is ended in
//! Task Manager) nothing would, and it would carry on writing levels for the
//! rest of its seeds.

use std::mem::size_of;
use std::ptr::null_mut;

use anyhow::bail;
use winapi::shared::minwindef::FALSE;
use winapi::um::handleapi::CloseHandle;
use winapi::um::jobapi2::{AssignProcessToJobObject, CreateJobObjectW, SetInformationJobObject};
use winapi::um::winnt::{
    JobObjectExtendedLimitInformation, HANDLE, JOBOBJECT_EXTENDED_LIMIT_INFORMATION,
    JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE,
};

/// A job that kills its processes when it's dropped or the Toolbox exits,
/// since Windows closes the handle either way
pub struct KillOnClose(HANDLE);

// Only used to close the handle
unsafe impl Send for KillOnClose {}

impl KillOnClose {
    pub fn new() -> anyhow::Result<Self> {
        unsafe {
            let job = CreateJobObjectW(null_mut(), null_mut());
            if job.is_null() {
                bail!("Couldn't create a job: {}", std::io::Error::last_os_error());
            }
            let job = Self(job);
            let mut info: JOBOBJECT_EXTENDED_LIMIT_INFORMATION = std::mem::zeroed();
            info.BasicLimitInformation.LimitFlags = JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE;
            if SetInformationJobObject(
                job.0,
                JobObjectExtendedLimitInformation,
                &mut info as *mut _ as *mut _,
                size_of::<JOBOBJECT_EXTENDED_LIMIT_INFORMATION>() as u32,
            ) == FALSE
            {
                bail!("Couldn't set up a job: {}", std::io::Error::last_os_error());
            }
            Ok(job)
        }
    }

    /// The game hd-seed-search starts joins the job too
    pub fn add(&self, process: HANDLE) -> anyhow::Result<()> {
        if unsafe { AssignProcessToJobObject(self.0, process) } == FALSE {
            bail!(
                "Couldn't add hd-seed-search to a job: {}",
                std::io::Error::last_os_error()
            );
        }
        Ok(())
    }
}

impl Drop for KillOnClose {
    fn drop(&mut self) {
        unsafe {
            CloseHandle(self.0);
        }
    }
}
