use async_trait::async_trait;

use hdt_mem_reader::manager::{ManagerHandle, PayloadResponse};
use serde::Serialize;

use super::tracker_task::TrackerTicker;
use super::trackers::Response;

#[derive(Debug, Serialize, Clone, PartialEq, Eq)]
pub struct PacifistResponse {
    pub total_kills: u32,
}

pub struct PacifistTracker {
    memory_handle: ManagerHandle,
}

impl PacifistTracker {
    pub fn new(memory_handle: ManagerHandle) -> Self {
        Self { memory_handle }
    }
}

#[async_trait]
impl TrackerTicker for PacifistTracker {
    async fn startup(&mut self) -> Option<Response> {
        if let Err(_) = self.memory_handle.connect().await {
            return Some(Response::Failure("Failed to connect to process.".into()));
        }
        None
    }

    async fn tick(&mut self) -> Response {
        let pacifist_data = match self
            .memory_handle
            .get_payload(hdt_mem_reader::manager::PayloadRequest::PacifistTracker)
            .await
        {
            Err(err) => {
                return Response::Failure(err.to_string());
            }
            Ok(PayloadResponse::Failure(err)) => {
                return Response::Failure(err.to_string());
            }
            Ok(PayloadResponse::PacifistTracker(pacifist_data)) => pacifist_data,
            _ => panic!("Got unexpected response..."),
        };
        Response::Pacifist(PacifistResponse {
            total_kills: pacifist_data.total_kills,
        })
    }
}
