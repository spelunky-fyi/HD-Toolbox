use std::{
    collections::HashMap,
    sync::{Arc, Mutex},
};

use hdt_mem_reader::manager::ManagerHandle;
use static_files::Resource;

use crate::tasks::trackers::Handle as TrackerHandle;

include!(concat!(env!("OUT_DIR"), "/generated.rs"));

pub struct State {
    pub mem_manager: ManagerHandle,
    pub tasks: Arc<Mutex<crate::tasks::Tasks>>,
    pub tracker_manager: TrackerHandle,
    pub tracker_resources: Arc<HashMap<&'static str, Resource>>,
}

impl State {
    pub fn new(mem_manager: ManagerHandle, tracker_manager: TrackerHandle) -> Self {
        State {
            mem_manager,
            tracker_manager,
            tracker_resources: Arc::new(generate()),
            tasks: Arc::new(Mutex::new(crate::tasks::Tasks {
                memory_updater: None,
                auto_fixer: None,
                web_server: None,
            })),
        }
    }
}
