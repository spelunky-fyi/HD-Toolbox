use std::collections::HashMap;
use std::pin::Pin;
use std::sync::Arc;
use std::task::{Context, Poll};
use std::time::Duration;

use futures::Future;
use hyper::header::CONTENT_TYPE;
use hyper::service::Service;
use hyper::{Body, Request, Response, Server, StatusCode};
use log::{debug, error, info};
use static_files::Resource;
use tauri::{self, AppHandle, Manager};
use tokio::select;
use tokio::{
    sync::oneshot,
    time::{interval, MissedTickBehavior},
};

use hdt_mem_reader::manager::ManagerHandle;

use super::{TaskUpdate, WebServerResponse};

static TASK_STATE_WEB_SERVER: &str = "task-state:WebServer";

struct Trackers {
    mem_handle: ManagerHandle,
    app_handle: AppHandle,
    tracker_resources: Arc<HashMap<&'static str, Resource>>,
}

impl Service<Request<Body>> for Trackers {
    type Response = Response<Body>;
    type Error = hyper::http::Error;
    type Future = Pin<Box<dyn Future<Output = Result<Self::Response, Self::Error>> + Send>>;

    fn poll_ready(&mut self, _: &mut Context) -> Poll<Result<(), Self::Error>> {
        Poll::Ready(Ok(()))
    }

    fn call(&mut self, mut req: Request<Body>) -> Self::Future {
        let path = req.uri().path();
        let mut static_key = &path[1..path.len()];
        if static_key.is_empty() {
            static_key = "index.html";
        }

        // Are you a static request?
        if let Some(resource) = self.tracker_resources.get(static_key) {
            let response = Response::builder()
                .header(CONTENT_TYPE, resource.mime_type)
                .status(StatusCode::OK)
                .body(Body::from(resource.data));
            return Box::pin(async { response });
        }

        let res = Ok(Response::new(Body::from("There's nothing here!")));
        Box::pin(async { res })
    }
}

struct MakeSvc {
    mem_handle: ManagerHandle,
    app_handle: AppHandle,
    tracker_resources: Arc<HashMap<&'static str, Resource>>,
}

impl<T> Service<T> for MakeSvc {
    type Response = Trackers;
    type Error = hyper::Error;
    type Future = Pin<Box<dyn Future<Output = Result<Self::Response, Self::Error>> + Send>>;

    fn poll_ready(&mut self, _: &mut Context) -> Poll<Result<(), Self::Error>> {
        Poll::Ready(Ok(()))
    }

    fn call(&mut self, _: T) -> Self::Future {
        let mem_handle = self.mem_handle.clone();
        let app_handle = self.app_handle.clone();
        let tracker_resources = self.tracker_resources.clone();

        let fut = async move {
            Ok(Trackers {
                mem_handle,
                app_handle,
                tracker_resources,
            })
        };
        Box::pin(fut)
    }
}

pub struct WebServerTask {
    shutdown_rx: Option<oneshot::Receiver<()>>,
    memory_handle: ManagerHandle,
    app_handle: AppHandle,
    tracker_resources: Arc<HashMap<&'static str, Resource>>,
    port: u16,
}

impl WebServerTask {
    pub fn new(
        memory_handle: ManagerHandle,
        app_handle: AppHandle,
        tracker_resources: Arc<HashMap<&'static str, Resource>>,

        port: u16,
    ) -> (Self, oneshot::Sender<()>) {
        let (shutdown_tx, shutdown_rx) = oneshot::channel();
        (
            Self {
                shutdown_rx: Some(shutdown_rx),
                memory_handle,
                app_handle,
                tracker_resources,
                port,
            },
            shutdown_tx,
        )
    }

    fn connected(&self) {
        if let Err(err) = self.app_handle.emit_all(
            TASK_STATE_WEB_SERVER,
            TaskUpdate::WebServer(WebServerResponse::WebServer),
        ) {
            error!("Failed to notify window: {:?}", err);
        }
    }

    fn failed(&self, msg: String) {
        if let Err(err) = self.app_handle.emit_all(
            TASK_STATE_WEB_SERVER,
            TaskUpdate::WebServer(WebServerResponse::Failure(msg)),
        ) {
            error!("Failed to notify window: {:?}", err);
        }
    }

    pub async fn run(&mut self) {
        debug!("WebServerTask::run - start");

        if let Some(shutdown_rx) = self.shutdown_rx.take() {
            let addr = ([127, 0, 0, 1], self.port).into();
            let service = MakeSvc {
                mem_handle: self.memory_handle.clone(),
                app_handle: self.app_handle.clone(),
                tracker_resources: self.tracker_resources.clone(),
            };
            let bind = match Server::try_bind(&addr) {
                Ok(bind) => bind,
                Err(_) => {
                    self.failed("Failed to bind server. Try a different port.".into());
                    return;
                }
            };
            let server = bind.serve(service);
            let graceful = server.with_graceful_shutdown(async move {
                shutdown_rx.await.ok();
            });
            self.connected();
            if let Err(e) = graceful.await {
                eprintln!("server error: {}", e);
            }
        };

        debug!("WebServerTask::run - end");
    }
}
