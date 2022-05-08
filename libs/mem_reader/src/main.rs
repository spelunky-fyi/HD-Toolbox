use hdt_mem_reader;

fn main() -> Result<(), anyhow::Error> {
    hdt_mem_reader::Process::new()?;

    Ok(())
}
