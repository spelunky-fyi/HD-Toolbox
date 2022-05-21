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
            let mut manager = hdt_mem_reader::manager::Manager::new(Duration::from_millis(16));
            let handle = manager.get_handle();
            let _ = tx.send(handle);

            manager.run_forever().await;
        })
    });
    let handle = rx.await?;

    tokio::time::sleep(Duration::from_secs(1)).await;

    let handle2 = handle.clone();

    tokio::spawn(async move {
        let mut rx = handle2
            .subscribe(hdt_mem_reader::manager::SubscriptionType::AllowedMem)
            .await
            .unwrap();

        while rx.changed().await.is_ok() {
            println!("received = {:?}", *rx.borrow());
        }
        println!("bye!");
    });

    tokio::time::sleep(Duration::from_secs(10)).await;
    handle.shutdown().await?;
    tokio::time::sleep(Duration::from_secs(1)).await;

    Ok(())
}
