use std::f32::consts::PI;
use std::fs::File;
use std::io::BufReader;
use std::time::Duration;

use rodio::source::{self};
use rodio::Sample;
use rodio::{source::Source, Decoder, OutputStream};

fn main() {
    println!("Hello");

    // Get a output stream handle to the default physical sound device
    let (_stream, stream_handle) = OutputStream::try_default().unwrap();
    let sink = rodio::Sink::try_new(&stream_handle).unwrap();

    // Load a sound from a file, using a path relative to Cargo.toml
    let file = BufReader::new(
        File::open(r"C:\Program Files (x86)\Steam\steamapps\common\Spelunky\Data\Music\A01_A.ogg")
            .unwrap(),
    );
    // Decode that sound file into a source
    let (source, controls) = hdt_music_engine::MusicEngineSource::new(
        Decoder::new(file).unwrap().convert_samples(),
        100,
    );

    // Play the sound directly on the device
    sink.append(source);

    // The sound plays in a separate audio thread,
    // so we need to keep the main thread alive while it's playing.
    std::thread::sleep(std::time::Duration::from_secs(2));
    controls.send(3_000);
    std::thread::sleep(std::time::Duration::from_secs(5));
    controls.send(10);
    std::thread::sleep(std::time::Duration::from_secs(1));
    sink.stop();
    sink.sleep_until_end();
}
