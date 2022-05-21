use std::{thread, time::Duration};

use tokio::{runtime, sync::oneshot};

use hdt_mem_reader::{self, manager::ManagerHandle};

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

    tokio::spawn(async move {
        handle2.connect().await.unwrap();

        loop {
            let response = handle2
                .get_payload(hdt_mem_reader::manager::PayloadRequest::AutoFixer)
                .await;
            println!("Response: {:?}", response);
            tokio::time::sleep(Duration::from_secs(1)).await;
        }
    });

    tokio::time::sleep(Duration::from_secs(10)).await;
    handle.shutdown().await?;
    tokio::time::sleep(Duration::from_secs(1)).await;

    Ok(())
}
