use std::{
    collections::HashMap,
    sync::{Arc, Mutex},
};

use serde_json::Value as JsonValue;
use static_files::Resource;
use tokio::sync::watch;

use hdt_mem_reader::manager::ManagerHandle;

use crate::tasks::trackers::Handle as TrackerHandle;

include!(concat!(env!("OUT_DIR"), "/generated.rs"));

pub struct State {
    pub mem_manager: ManagerHandle,
    pub tasks: Arc<Mutex<crate::tasks::Tasks>>,
    pub tracker_manager: TrackerHandle,
    pub tracker_resources: Arc<HashMap<&'static str, Resource>>,
    pub autofix_config_watcher: watch::Receiver<HashMap<String, JsonValue>>,
    pub music_engine_config_watcher: watch::Receiver<HashMap<String, JsonValue>>,
}

impl State {
    pub fn new(
        mem_manager: ManagerHandle,
        tracker_manager: TrackerHandle,
        autofix_config_watcher: watch::Receiver<HashMap<String, JsonValue>>,
        music_engine_config_watcher: watch::Receiver<HashMap<String, JsonValue>>,
    ) -> Self {
        State {
            mem_manager,
            tracker_manager,
            tracker_resources: Arc::new(generate()),
            tasks: Arc::new(Mutex::new(crate::tasks::Tasks {
                memory_updater: None,
                auto_fixer: None,
                web_server: None,
                music_engine: None,
            })),
            autofix_config_watcher,
            music_engine_config_watcher,
        }
    }
}
