use tokio::fs::File;
use tokio::io::{BufReader, BufWriter};

use hdt_wad_wix;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let handle = File::open(
        r"C:\Program Files (x86)\Steam\steamapps\common\Spelunky\Data\Textures\alltex.wad.wix",
    )
    .await?;
    let reader = BufReader::new(handle);

    let wix = hdt_wad_wix::Wix::from_reader(reader).await?;
    let mut outfile = File::create("alltex2.wad.wix").await?;
    let writer = BufWriter::new(&mut outfile);
    wix.to_writer(writer).await?;

    Ok(())
}
