use std::time::Duration;

use hdt_mem_reader;

#[tokio::main]
async fn main() -> Result<(), anyhow::Error> {
    let mut manager = hdt_mem_reader::manager::Manager::new(Duration::from_millis(16));
    let handle = manager.get_handle();

    tokio::spawn(async move { manager.run_forever().await });

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
