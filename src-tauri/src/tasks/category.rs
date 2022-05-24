use async_trait::async_trait;

use hdt_mem_reader::manager::ManagerHandle;
use serde::Serialize;

use super::tracker_task::TrackerTicker;
use super::trackers::Response;

#[derive(Debug, Serialize, Clone, PartialEq, Eq)]
pub struct CategoryResponse {}

pub struct CategoryTracker {
    memory_handle: ManagerHandle,
}

impl CategoryTracker {
    pub fn new(memory_handle: ManagerHandle) -> Self {
        Self { memory_handle }
    }
}

#[async_trait]
impl TrackerTicker for CategoryTracker {
    async fn startup(&mut self) -> Option<Response> {
        if let Err(_) = self.memory_handle.connect().await {
            return Some(Response::Failure("Failed to connect to process.".into()));
        }
        None
    }

    async fn tick(&mut self) -> Response {
        Response::Category(CategoryResponse {})
    }
}
