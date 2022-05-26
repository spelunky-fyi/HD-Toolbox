use std::{collections::HashMap, time::Duration};

use async_trait::async_trait;
use log::{debug, warn};
use serde::de::DeserializeOwned;
use serde::Serialize;
use serde_json::Value as JsonValue;
use tokio::select;
use tokio::time::Instant;
use tokio::{
    sync::mpsc,
    sync::oneshot,
    sync::watch,
    time::{interval, interval_at, MissedTickBehavior},
};

use super::trackers::Response;

#[async_trait]
pub trait TrackerTicker {
    type Config: Default + DeserializeOwned + Serialize;

    async fn startup(&mut self) -> Option<Response> {
        None
    }

    async fn tick(&mut self, config: &Self::Config) -> Response;
}

#[derive(Debug)]
enum TrackerTaskMessage {
    Subscribe(oneshot::Sender<watch::Receiver<Response>>),
    Shutdown(oneshot::Sender<()>),
    IsStale(oneshot::Sender<bool>),
}

pub struct TrackerTask {
    handle_tx: mpsc::Sender<TrackerTaskMessage>,
    handle_rx: mpsc::Receiver<TrackerTaskMessage>,

    watcher: watch::Sender<Response>,

    last_non_empty: Instant,

    config: watch::Receiver<HashMap<String, JsonValue>>,
}

impl TrackerTask {
    pub fn new(config: watch::Receiver<HashMap<String, JsonValue>>) -> Self {
        let (handle_tx, handle_rx) = mpsc::channel::<TrackerTaskMessage>(100);
        let (watcher, _) = watch::channel(Response::Empty);
        Self {
            handle_tx,
            handle_rx,
            watcher,
            last_non_empty: Instant::now(),
            config,
        }
    }

    pub fn get_handle(&self) -> TrackerTaskHandle {
        TrackerTaskHandle {
            handle_tx: self.handle_tx.clone(),
        }
    }

    pub fn serialize_config<T: TrackerTicker>(&self) -> T::Config {
        let config = self.config.borrow().clone();

        let value = match serde_json::to_value(config) {
            Ok(value) => value,
            Err(err) => {
                warn!("Failed to convert config to JSON Value... {:?}", err);
                return T::Config::default();
            }
        };

        match serde_json::from_value(value) {
            Ok(value) => value,
            Err(err) => {
                warn!("Failed to deserialize config, using default... {:?}", err);
                T::Config::default()
            }
        }
    }

    pub async fn run<T: TrackerTicker + Send>(&mut self, mut ticker: T) {
        debug!("Starting Tracker Task");
        let mut staleness_interval = interval(Duration::from_millis(1000));
        staleness_interval.set_missed_tick_behavior(MissedTickBehavior::Delay);

        let mut tick_interval = interval(Duration::from_millis(16));
        tick_interval.set_missed_tick_behavior(MissedTickBehavior::Delay);

        if let Some(response) = ticker.startup().await {
            self.watcher.send(response).ok();
        }

        let mut last_response = None;
        let mut last_send = Instant::now();

        let mut config = self.serialize_config::<T>();

        loop {
            select! {
                _ = self.config.changed() => {
                    debug!("Config changed.");
                    config = self.serialize_config::<T>();
                }
                msg = self.handle_rx.recv() => {
                    if let Some(msg) = msg {
                        match msg {
                            TrackerTaskMessage::Shutdown(response) => {
                                response.send(()).ok();
                                break;
                            }
                            TrackerTaskMessage::Subscribe(response) =>{
                                debug!("New Subscriber for Tracker Task");
                                response.send(self.watcher.subscribe()).ok();
                            }
                            TrackerTaskMessage::IsStale(response) => {
                                let is_stale = Instant::now() - self.last_non_empty > Duration::from_secs(60);
                                response.send(is_stale).ok();
                            }
                        }
                    }
                }
                _ = tick_interval.tick() => {
                        let response = ticker.tick(&config).await;
                        // Slow down while we're failing.
                        if let Response::Failure(_) = &response {
                            tick_interval = interval_at(Instant::now() + Duration::from_secs(1), Duration::from_millis(16));
                            tick_interval.set_missed_tick_behavior(MissedTickBehavior::Delay);
                        }

                        if let Some(last_response) = &last_response  {
                            if &response == last_response && Instant::now() - last_send < Duration::from_secs(2){
                                continue;
                            }
                        }

                        last_send = Instant::now();
                        last_response = Some(response.clone());

                        self.watcher.send(response).ok();
                }
                _ = staleness_interval.tick() => {
                    if self.watcher.receiver_count() > 0 {
                        self.last_non_empty = Instant::now();
                    }
                }
            }
        }
        debug!("Shutting Down Tracker Task");
    }
}

#[derive(Clone)]
pub struct TrackerTaskHandle {
    handle_tx: mpsc::Sender<TrackerTaskMessage>,
}

impl TrackerTaskHandle {
    pub async fn subscribe(&self) -> anyhow::Result<watch::Receiver<Response>> {
        let (tx, rx) = oneshot::channel();
        self.handle_tx
            .send(TrackerTaskMessage::Subscribe(tx))
            .await?;
        Ok(rx.await?)
    }

    pub async fn shutdown(&self) -> anyhow::Result<()> {
        let (tx, rx) = oneshot::channel();
        self.handle_tx
            .send(TrackerTaskMessage::Shutdown(tx))
            .await?;
        Ok(rx.await?)
    }

    pub async fn is_stale(&self) -> anyhow::Result<bool> {
        let (tx, rx) = oneshot::channel();
        self.handle_tx.send(TrackerTaskMessage::IsStale(tx)).await?;
        Ok(rx.await?)
    }
}
