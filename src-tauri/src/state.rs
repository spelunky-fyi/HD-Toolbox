use std::sync::{Arc, Mutex};

use hdt_mem_reader::manager::ManagerHandle;

pub struct State {
    pub mem_manager: ManagerHandle,
    pub tasks: Arc<Mutex<crate::tasks::Tasks>>,
}

impl State {
    pub fn new(mem_manager: ManagerHandle) -> Self {
        State {
            mem_manager,
            tasks: Arc::new(Mutex::new(crate::tasks::Tasks {
                memory_updater: None,
                auto_fixer: None,
                web_server: None,
            })),
        }
    }
}
