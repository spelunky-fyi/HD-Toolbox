use std::{thread, time::Duration};

use tokio::{runtime, sync::oneshot, time::Instant};

use hdt_mem_reader::{
    self,
    manager::{ManagerHandle, PayloadResponse},
};

#[tokio::main]
async fn main() -> Result<(), anyhow::Error> {
    let (tx, rx) = oneshot::channel::<ManagerHandle>();
    thread::spawn(move || {
        let basic_rt = runtime::Builder::new_current_thread()
            .enable_all()
            .build()
            .unwrap();
        basic_rt.block_on(async {
            let mut manager = hdt_mem_reader::manager::Manager::new();
            let handle = manager.get_handle();
            let _ = tx.send(handle);

            manager.run_forever().await;
        })
    });

    tokio::time::sleep(Duration::from_secs(1)).await;

    let handle = rx.await?;
    let handle2 = handle.clone();

    let task = tokio::spawn(async move {
        handle2.connect().await.unwrap();

        let mut last_response = PayloadResponse::Success;

        loop {
            let start = Instant::now();
            let response = handle2
                .get_payload(hdt_mem_reader::manager::PayloadRequest::CategoryTracker)
                .await;
            let response = match response {
                Ok(response) => response,
                Err(_) => continue,
            };
            let finish = Instant::now();
            let _time_to_run = finish - start;
            //println!("{}", time_to_run.as_micros());

            if response != last_response {
                println!("Response: {:?}", response);
                last_response = response
            }
            tokio::time::sleep(Duration::from_millis(16)).await;
        }
    });
    let _ = task.await;
    tokio::time::sleep(Duration::from_secs(10)).await;
    handle.shutdown().await?;
    tokio::time::sleep(Duration::from_secs(1)).await;

    Ok(())
}
