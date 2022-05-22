use std::io::Cursor;
use std::time::Duration;

use byteorder::ByteOrder;
use byteorder::ReadBytesExt;
use byteorder::LE;
use log::{debug, info};
use serde::Serialize;
use tokio::select;
use tokio::sync::{mpsc, oneshot};
use tokio::time::interval;
use tokio::time::Instant;
use tokio::time::MissedTickBehavior;

use crate::process::ReadMemoryError;
use crate::process::{Failure, Process};

#[derive(Debug, Serialize, Clone, Default, PartialEq, Eq)]
pub struct MemoryUpdaterPayload {
    // This is stored as a float but that breaks equality.
    // Normal    - 1.0 (0x3F800000)
    // Slow Look - 0.2 (0x3E4CCCCD)
    camera_speed: u32,

    chars: [u32; 16],
}

impl MemoryUpdaterPayload {
    fn from_process(process: &Process) -> Result<Self, Failure> {
        let base_addr = process.base_addr;
        let other_state_offset =
            process.read_u32(base_addr + process.offsets.other_state)? as usize;
        let global_state_offset =
            process.read_u32(base_addr + process.offsets.global_state)? as usize;

        let mut chars_cursor =
            Cursor::new(process.read_n_bytes(global_state_offset + 0x4459c8 + 0xa24, 16 * 4)?);

        let chars = [
            chars_cursor
                .read_u32::<LE>()
                .map_err(|_| ReadMemoryError::Failed)?,
            chars_cursor
                .read_u32::<LE>()
                .map_err(|_| ReadMemoryError::Failed)?,
            chars_cursor
                .read_u32::<LE>()
                .map_err(|_| ReadMemoryError::Failed)?,
            chars_cursor
                .read_u32::<LE>()
                .map_err(|_| ReadMemoryError::Failed)?,
            chars_cursor
                .read_u32::<LE>()
                .map_err(|_| ReadMemoryError::Failed)?,
            chars_cursor
                .read_u32::<LE>()
                .map_err(|_| ReadMemoryError::Failed)?,
            chars_cursor
                .read_u32::<LE>()
                .map_err(|_| ReadMemoryError::Failed)?,
            chars_cursor
                .read_u32::<LE>()
                .map_err(|_| ReadMemoryError::Failed)?,
            chars_cursor
                .read_u32::<LE>()
                .map_err(|_| ReadMemoryError::Failed)?,
            chars_cursor
                .read_u32::<LE>()
                .map_err(|_| ReadMemoryError::Failed)?,
            chars_cursor
                .read_u32::<LE>()
                .map_err(|_| ReadMemoryError::Failed)?,
            chars_cursor
                .read_u32::<LE>()
                .map_err(|_| ReadMemoryError::Failed)?,
            chars_cursor
                .read_u32::<LE>()
                .map_err(|_| ReadMemoryError::Failed)?,
            chars_cursor
                .read_u32::<LE>()
                .map_err(|_| ReadMemoryError::Failed)?,
            chars_cursor
                .read_u32::<LE>()
                .map_err(|_| ReadMemoryError::Failed)?,
            chars_cursor
                .read_u32::<LE>()
                .map_err(|_| ReadMemoryError::Failed)?,
        ];

        Ok(Self {
            camera_speed: process.read_u32(other_state_offset + 0x38)?,
            chars,
        })
    }
}

#[derive(Debug, Serialize, Clone, PartialEq, Eq)]
pub enum AutoFixerState {
    NoSlowLook,
    SlowLookWaiting,
    SlowLookFixed,
}

impl Default for AutoFixerState {
    fn default() -> Self {
        AutoFixerState::NoSlowLook
    }
}

#[derive(Debug, Serialize, Clone, Default, PartialEq, Eq)]
pub struct AutoFixerPayload {
    state: AutoFixerState,
}

impl AutoFixerPayload {
    fn from_process(process: &Process) -> Result<Self, Failure> {
        let base_addr = process.base_addr;
        let other_state_offset =
            process.read_u32(base_addr + process.offsets.other_state)? as usize;
        let camera_speed = process.read_u32(other_state_offset + 0x38)?;

        if camera_speed == 0x3F800000 {
            return Ok(Self {
                state: AutoFixerState::NoSlowLook,
            });
        }

        let global_state_offset =
            process.read_u32(base_addr + process.offsets.global_state)? as usize;
        let screen_state = process.read_u32(global_state_offset + 0x58)? as usize;

        // Gameplay Screen States
        if screen_state <= 11 {
            return Ok(Self {
                state: AutoFixerState::SlowLookWaiting,
            });
        }

        let mut bytes = vec![0; 4];
        LE::write_u32(&mut bytes, 0x3F800000);

        process.write_n_bytes(other_state_offset + 0x38, bytes)?;

        // PayloadResponse::Success
        Ok(Self {
            state: AutoFixerState::SlowLookFixed,
        })
    }
}

#[derive(Debug, Serialize, Clone, Default, PartialEq, Eq)]
pub struct CategoryTrackerPayload {}

impl CategoryTrackerPayload {
    fn from_process(_process: &Process) -> Result<Self, Failure> {
        Ok(Self {})
    }
}

#[derive(Debug, Serialize, Clone, Default, PartialEq, Eq)]
pub struct PacifistTrackerPayload {}

impl PacifistTrackerPayload {
    fn from_process(_process: &Process) -> Result<Self, Failure> {
        Ok(Self {})
    }
}

#[derive(Debug)]
pub enum PayloadRequest {
    MemoryUpdater,
    AutoFixer,
    CategoryTracker,
    PacifistTracker,

    FixSlowLook,
    SetCharacter(usize, u32),
}

#[derive(Debug, Serialize, Clone, PartialEq, Eq)]
#[serde(tag = "type", content = "data")]
pub enum PayloadResponse {
    MemoryUpdater(MemoryUpdaterPayload),
    AutoFixer(AutoFixerPayload),
    CategoryTracker(CategoryTrackerPayload),
    PacifistTracker(PacifistTrackerPayload),
    Failure(Failure),

    // Empty sucess response
    Success,
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
                PayloadRequest::FixSlowLook => {
                    let mut bytes = vec![0; 4];
                    LE::write_u32(&mut bytes, 0x3F800000);

                    let base_addr = process.base_addr;
                    let other_state_offset =
                        match process.read_u32(base_addr + process.offsets.other_state) {
                            Ok(offset) => offset,
                            Err(err) => {
                                let _ = response.send(PayloadResponse::Failure(err.into()));
                                return;
                            }
                        } as usize;

                    if let Err(err) = process.write_n_bytes(other_state_offset + 0x38, bytes) {
                        let _ = response.send(PayloadResponse::Failure(err.into()));
                        return;
                    }

                    PayloadResponse::Success
                }
                PayloadRequest::SetCharacter(index, value) => {
                    if index > 15 {
                        let _ = response.send(PayloadResponse::Failure(Failure::Unknown(
                            "Invalid Index".into(),
                        )));
                        return;
                    }

                    if value != 0 && value != 1 {
                        let _ = response.send(PayloadResponse::Failure(Failure::Unknown(
                            "Invalid Value".into(),
                        )));
                        return;
                    }

                    let mut bytes = vec![0; 4];
                    LE::write_u32(&mut bytes, value);

                    let base_addr = process.base_addr;
                    let global_state_offset =
                        match process.read_u32(base_addr + process.offsets.global_state) {
                            Ok(offset) => offset,
                            Err(err) => {
                                let _ = response.send(PayloadResponse::Failure(err.into()));
                                return;
                            }
                        } as usize;

                    let char_offset = global_state_offset + 0x4459c8 + 0xa24 + (index * 4);
                    dbg!(&char_offset);
                    if let Err(err) = process.write_n_bytes(char_offset, bytes) {
                        let _ = response.send(PayloadResponse::Failure(err.into()));
                        return;
                    }

                    PayloadResponse::Success
                }
            };

            if let PayloadResponse::Failure(_) = &payload_response {
                self.process = None;
            }
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
