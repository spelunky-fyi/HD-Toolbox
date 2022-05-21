use std::time::Duration;

use log::{debug, info};
use serde::Serialize;
use tokio::select;
use tokio::sync::{mpsc, oneshot};
use tokio::time::interval;
use tokio::time::Instant;
use tokio::time::MissedTickBehavior;

use crate::process::{Failure, Process};

#[derive(Debug, Serialize, Clone, Default, PartialEq, Eq)]
pub struct MemoryUpdaterPayload {}

impl MemoryUpdaterPayload {
    fn from_process(process: &Process) -> Result<Self, Failure> {
        Ok(Self {})
    }
}

#[derive(Debug, Serialize, Clone, Default, PartialEq, Eq)]
pub struct AutoFixerPayload {}

impl AutoFixerPayload {
    fn from_process(process: &Process) -> Result<Self, Failure> {
        Ok(Self {})
    }
}

#[derive(Debug, Serialize, Clone, Default, PartialEq, Eq)]
pub struct CategoryTrackerPayload {}

impl CategoryTrackerPayload {
    fn from_process(process: &Process) -> Result<Self, Failure> {
        Ok(Self {})
    }
}

#[derive(Debug, Serialize, Clone, Default, PartialEq, Eq)]
pub struct PacifistTrackerPayload {}

impl PacifistTrackerPayload {
    fn from_process(process: &Process) -> Result<Self, Failure> {
        Ok(Self {})
    }
}

#[derive(Debug)]
pub enum PayloadRequest {
    MemoryUpdater,
    AutoFixer,
    CategoryTracker,
    PacifistTracker,
}

#[derive(Debug, Serialize, Clone, PartialEq, Eq)]
pub enum PayloadResponse {
    MemoryUpdater(MemoryUpdaterPayload),
    AutoFixer(AutoFixerPayload),
    CategoryTracker(CategoryTrackerPayload),
    PacifistTracker(PacifistTrackerPayload),
    Failure(Failure),
}

#[derive(Debug)]
enum ManagerMessage {
    Connect(oneshot::Sender<Result<(), Failure>>),
    GetPayload(PayloadRequest, oneshot::Sender<PayloadResponse>),
    Shutdown(oneshot::Sender<()>),
    Attached(oneshot::Sender<bool>),
}

pub struct Manager {
    handle_tx: mpsc::Sender<ManagerMessage>,
    handle_rx: mpsc::Receiver<ManagerMessage>,
    shutdown_tx: Option<oneshot::Sender<()>>,
    process: Option<Process>,
    last_request: Instant,
}

impl Manager {
    pub fn new() -> Self {
        let (handle_tx, handle_rx) = mpsc::channel::<ManagerMessage>(100);
        Self {
            handle_tx,
            handle_rx,
            shutdown_tx: None,
            process: None,
            last_request: Instant::now(),
        }
    }

    pub fn get_handle(&self) -> ManagerHandle {
        ManagerHandle {
            handle_tx: self.handle_tx.clone(),
        }
    }

    pub async fn run_forever(&mut self) {
        debug!("Running Memory Manager!");
        let mut poll_interval = interval(Duration::from_secs(1));
        poll_interval.set_missed_tick_behavior(MissedTickBehavior::Delay);
        let (shutdown_tx, mut shutdown_rx) = oneshot::channel();
        self.shutdown_tx = Some(shutdown_tx);

        loop {
            select! {
                _ = &mut shutdown_rx => {
                    debug!("Shutting down Memory Manager!");
                    break;
                }
                _ = poll_interval.tick() => {
                    if Instant::now() - self.last_request > Duration::from_secs(10) {
                        if let Some(_) = self.process.take() {
                            info!("Closing process due to lack of requests...")
                        }
                    }
                }
                msg = self.handle_rx.recv() => {
                    if let Some(msg) = msg {
                        self.handle_msg(msg).await;
                    }
                }
            }
        }
    }

    fn ensure_connected(&mut self) -> Result<(), Failure> {
        self.last_request = Instant::now();
        if self.process.is_none() {
            match Process::new() {
                Ok(process) => self.process = Some(process),
                Err(err) => {
                    return Err(err.into());
                }
            }
        }
        Ok(())
    }

    async fn handle_msg(&mut self, msg: ManagerMessage) {
        match msg {
            ManagerMessage::Connect(response) => {
                self.handle_connect(response);
            }
            ManagerMessage::GetPayload(request, response) => {
                self.handle_get_payload(request, response);
            }
            ManagerMessage::Shutdown(response) => {
                self.handle_shutdown(response);
            }
            ManagerMessage::Attached(response) => {
                self.handle_attached(response);
            }
        };
    }

    fn handle_connect(&mut self, response: oneshot::Sender<Result<(), Failure>>) {
        let _ = response.send(self.ensure_connected());
    }

    fn handle_get_payload(
        &mut self,
        request: PayloadRequest,
        response: oneshot::Sender<PayloadResponse>,
    ) {
        if let Err(err) = self.ensure_connected() {
            let _ = response.send(PayloadResponse::Failure(err));
            return;
        }

        if let Some(process) = &self.process {
            let payload_response = match request {
                PayloadRequest::MemoryUpdater => {
                    match MemoryUpdaterPayload::from_process(process) {
                        Ok(payload) => PayloadResponse::MemoryUpdater(payload),
                        Err(err) => PayloadResponse::Failure(err),
                    }
                }
                PayloadRequest::AutoFixer => match AutoFixerPayload::from_process(process) {
                    Ok(payload) => PayloadResponse::AutoFixer(payload),
                    Err(err) => PayloadResponse::Failure(err),
                },
                PayloadRequest::CategoryTracker => {
                    match CategoryTrackerPayload::from_process(process) {
                        Ok(payload) => PayloadResponse::CategoryTracker(payload),
                        Err(err) => PayloadResponse::Failure(err),
                    }
                }
                PayloadRequest::PacifistTracker => {
                    match PacifistTrackerPayload::from_process(process) {
                        Ok(payload) => PayloadResponse::PacifistTracker(payload),
                        Err(err) => PayloadResponse::Failure(err),
                    }
                }
            };
            let _ = response.send(payload_response);
        }
    }

    fn handle_shutdown(&mut self, response: oneshot::Sender<()>) {
        if let Some(tx) = self.shutdown_tx.take() {
            let _ = tx.send(());
        }
        let _ = response.send(());
    }

    fn handle_attached(&mut self, response: oneshot::Sender<bool>) {
        let _ = response.send(self.process.is_some());
    }
}

#[derive(Clone)]
pub struct ManagerHandle {
    handle_tx: mpsc::Sender<ManagerMessage>,
}

impl ManagerHandle {
    pub async fn connect(&self) -> anyhow::Result<()> {
        let (tx, rx) = oneshot::channel();
        self.handle_tx.send(ManagerMessage::Connect(tx)).await?;

        Ok(rx.await??)
    }

    pub async fn get_payload(&self, request: PayloadRequest) -> anyhow::Result<PayloadResponse> {
        let (tx, rx) = oneshot::channel();
        self.handle_tx
            .send(ManagerMessage::GetPayload(request, tx))
            .await?;

        Ok(rx.await?)
    }

    pub async fn shutdown(&self) -> anyhow::Result<()> {
        let (tx, rx) = oneshot::channel();
        self.handle_tx.send(ManagerMessage::Shutdown(tx)).await?;
        Ok(rx.await?)
    }

    pub async fn attached(&self) -> anyhow::Result<bool> {
        let (tx, rx) = oneshot::channel();
        self.handle_tx.send(ManagerMessage::Attached(tx)).await?;
        Ok(rx.await?)
    }
}
