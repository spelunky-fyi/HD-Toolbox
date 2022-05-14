use std::collections::hash_map::Entry;
use std::collections::HashMap;
use std::sync::Arc;
use std::time::Duration;

use tokio::select;
use tokio::sync::{mpsc, oneshot, watch};
use tokio::time::Instant;
use tokio::time::MissedTickBehavior;
use tokio::time::{interval, interval_at};

use crate::process::{Failure, Process};

#[derive(Debug, PartialEq, Eq, Hash, Clone)]
pub enum SubscriptionType {
    AllowedMem,
    KillTracker,
    CategoryTracker,
}

#[derive(Debug)]

pub enum SubscriptionMessage {
    Empty,

    // Placeholder until actual structs are created
    AllowedMem(Instant),
    KillTracker(Instant),
    CategoryTracker(Instant),
    Error(Failure),
}

#[derive(Debug)]
enum ManagerMessage {
    Subscribe(
        SubscriptionType,
        oneshot::Sender<watch::Receiver<SubscriptionMessage>>,
    ),
    Shutdown(oneshot::Sender<()>),
    Attached(oneshot::Sender<bool>),
}

pub struct Manager {
    subscriptions: HashMap<SubscriptionType, watch::Sender<SubscriptionMessage>>,
    handle_tx: mpsc::Sender<ManagerMessage>,
    handle_rx: mpsc::Receiver<ManagerMessage>,
    shutdown_tx: Option<oneshot::Sender<()>>,
    process: Option<Process>,
    pub poll_interval: Duration,
    pub backoff: Duration,
}

impl Manager {
    pub fn new(poll_interval: Duration) -> Self {
        let (handle_tx, handle_rx) = mpsc::channel::<ManagerMessage>(100);
        Self {
            subscriptions: HashMap::new(),
            handle_tx,
            handle_rx,
            shutdown_tx: None,
            process: None,
            poll_interval,
            backoff: Duration::from_millis(250),
        }
    }

    pub fn get_handle(&self) -> Arc<ManagerHandle> {
        Arc::new(ManagerHandle {
            handle_tx: self.handle_tx.clone(),
        })
    }

    pub async fn run_forever(&mut self) {
        let mut poll_interval = interval(self.poll_interval);
        poll_interval.set_missed_tick_behavior(MissedTickBehavior::Delay);
        let (shutdown_tx, mut shutdown_rx) = oneshot::channel();
        self.shutdown_tx = Some(shutdown_tx);

        loop {
            select! {
                _ = &mut shutdown_rx => {
                    break;
                }
                now = poll_interval.tick() => {
                    // If we have no subscriptions or a connection error delay for backoff amount.
                    if let Err(_) = self.handle_subscriptions(now).await {
                        poll_interval = interval_at(Instant::now() + self.backoff, self.poll_interval);
                        poll_interval.set_missed_tick_behavior(MissedTickBehavior::Delay);
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

    async fn handle_subscriptions(&mut self, now: Instant) -> Result<(), ()> {
        if self.subscriptions.is_empty() {
            // No subscriptions so use backoff time.
            return Err(());
        }

        let mut to_remove = vec![];
        if self.process.is_none() {
            match Process::new() {
                Ok(process) => self.process = Some(process),
                Err(err) => {
                    let err: Failure = err.into();
                    for (subscription_type, tx) in &self.subscriptions {
                        // Failed to send. All receivers must have gone away.
                        if let Err(_) = tx.send(SubscriptionMessage::Error(err.clone())) {
                            to_remove.push((*subscription_type).clone());
                        }
                    }

                    for subscription_type in to_remove {
                        self.subscriptions.remove(&subscription_type);
                    }
                    return Err(());
                }
            }
        }

        for (subscription_type, tx) in &self.subscriptions {
            let response = match *subscription_type {
                SubscriptionType::AllowedMem => SubscriptionMessage::AllowedMem(now),
                SubscriptionType::KillTracker => SubscriptionMessage::KillTracker(now),
                SubscriptionType::CategoryTracker => SubscriptionMessage::CategoryTracker(now),
            };

            // Failed to send. All receivers must have gone away.
            if let Err(_) = tx.send(response) {
                to_remove.push((*subscription_type).clone());
            }
        }

        for subscription_type in to_remove {
            self.subscriptions.remove(&subscription_type);
        }

        Ok(())
    }

    async fn handle_msg(&mut self, msg: ManagerMessage) {
        match msg {
            ManagerMessage::Subscribe(subscription_type, response) => {
                self.handle_subscribe(subscription_type, response);
            }
            ManagerMessage::Shutdown(response) => {
                self.handle_shutdown(response);
            }
            ManagerMessage::Attached(response) => {
                self.handle_attached(response);
            }
        };
    }

    fn handle_subscribe(
        &mut self,
        subscription_type: SubscriptionType,
        response: oneshot::Sender<watch::Receiver<SubscriptionMessage>>,
    ) {
        match self.subscriptions.entry(subscription_type) {
            Entry::Occupied(entry) => {
                let _ = response.send((*entry.get()).subscribe());
            }
            Entry::Vacant(entry) => {
                let (tx, rx) = watch::channel(SubscriptionMessage::Empty);
                entry.insert(tx);
                let _ = response.send(rx);
            }
        }
    }

    fn handle_shutdown(&mut self, response: oneshot::Sender<()>) {
        if let Some(tx) = self.shutdown_tx.take() {
            let _ = tx.send(());
        }
        let _ = response.send(());
    }

    fn handle_attached(&mut self, response: oneshot::Sender<bool>) {
        let _ = response.send(false);
    }
}

pub struct ManagerHandle {
    handle_tx: mpsc::Sender<ManagerMessage>,
}

impl ManagerHandle {
    pub async fn subscribe(
        &self,
        subscription_type: SubscriptionType,
    ) -> anyhow::Result<watch::Receiver<SubscriptionMessage>> {
        let (tx, rx) = oneshot::channel();
        self.handle_tx
            .send(ManagerMessage::Subscribe(subscription_type, tx))
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
