use async_trait::async_trait;

use hdt_mem_reader::manager::{ManagerHandle, PayloadResponse};
use serde::Serialize;

use crate::config::CategoryConfig;

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
    type Config = CategoryConfig;

    async fn startup(&mut self) -> Option<Response> {
        if let Err(_) = self.memory_handle.connect().await {
            return Some(Response::Failure("Failed to connect to process.".into()));
        }
        None
    }

    async fn tick(&mut self, _config: &Self::Config) -> Response {
        let _category_data = match self
            .memory_handle
            .get_payload(hdt_mem_reader::manager::PayloadRequest::CategoryTracker)
            .await
        {
            Err(err) => {
                return Response::Failure(err.to_string());
            }
            Ok(PayloadResponse::Failure(err)) => {
                return Response::Failure(err.to_string());
            }
            Ok(PayloadResponse::CategoryTracker(category_data)) => category_data,
            _ => panic!("Got unexpected response..."),
        };

        Response::Category(CategoryResponse {})
    }
}
