use std::f32::consts::PI;
use std::sync::mpsc;
use std::time::Duration;

use rodio::Source;

#[derive(Debug)]
pub struct MusicEngineSource<I> {
    input: I,

    controls: mpsc::Receiver<i32>,

    // Lowpass Filter attributes
    lowpass_cutoff_freq_current: i32,
    lowpass_cutoff_freq_target: i32,
    lowpass_cutoff_freq_change_interval: i32,
    lowpass_cutoff_freq_disable: i32,
    lowpass_applier: Option<LowPassApplier>,
    x_n1: f32,
    x_n2: f32,
    y_n1: f32,
    y_n2: f32,
}

impl<I> MusicEngineSource<I> {
    pub fn new(input: I, lowpass_cutoff_freq: i32) -> (MusicEngineSource<I>, mpsc::SyncSender<i32>)
    where
        I: Source<Item = f32>,
    {
        let (tx, rx) = mpsc::sync_channel(10);

        (
            MusicEngineSource {
                input,
                controls: rx,
                lowpass_cutoff_freq_current: lowpass_cutoff_freq,
                lowpass_cutoff_freq_target: lowpass_cutoff_freq,
                lowpass_cutoff_freq_change_interval: 150,
                lowpass_cutoff_freq_disable: 3_000,
                lowpass_applier: None,
                x_n1: 0.0,
                x_n2: 0.0,
                y_n1: 0.0,
                y_n2: 0.0,
            },
            tx,
        )
    }

    /// Returns a reference to the inner source.
    #[inline]
    pub fn inner(&self) -> &I {
        &self.input
    }

    /// Returns a mutable reference to the inner source.
    #[inline]
    pub fn inner_mut(&mut self) -> &mut I {
        &mut self.input
    }

    /// Returns the inner source.
    #[inline]
    pub fn into_inner(self) -> I {
        self.input
    }
}

#[inline]
pub fn clamp(input: i32, min: i32, max: i32) -> i32 {
    debug_assert!(min <= max, "min must be less than or equal to max");
    if input < min {
        min
    } else if input > max {
        max
    } else {
        input
    }
}

impl<I> Iterator for MusicEngineSource<I>
where
    I: Source<Item = f32>,
{
    type Item = f32;

    #[inline]
    fn next(&mut self) -> Option<f32> {
        while let Ok(value) = self.controls.try_recv() {
            self.lowpass_cutoff_freq_target = value;
        }

        let sample = match self.input.next() {
            None => return None,
            Some(s) => s,
        };

        let last_in_frame = self.input.current_frame_len() == Some(1);

        if self.lowpass_cutoff_freq_current >= self.lowpass_cutoff_freq_disable
            && self.lowpass_cutoff_freq_target >= self.lowpass_cutoff_freq_disable
        {
            return Some(sample);
        }

        if self.lowpass_applier.is_none() {
            // Adjust frequency between frames
            if self.lowpass_cutoff_freq_current != self.lowpass_cutoff_freq_target {
                self.lowpass_cutoff_freq_current += clamp(
                    self.lowpass_cutoff_freq_target as i32
                        - self.lowpass_cutoff_freq_current as i32,
                    -self.lowpass_cutoff_freq_change_interval,
                    self.lowpass_cutoff_freq_change_interval,
                );
                println!("{}", self.lowpass_cutoff_freq_current);
            }

            self.lowpass_applier = Some(LowPassApplier::new(
                self.lowpass_cutoff_freq_current,
                self.input.sample_rate(),
            ));
        }

        let result = self
            .lowpass_applier
            .as_ref()
            .unwrap()
            .apply(sample, self.x_n1, self.x_n2, self.y_n1, self.y_n2);

        self.y_n2 = self.y_n1;
        self.x_n2 = self.x_n1;
        self.y_n1 = result;
        self.x_n1 = sample;

        if last_in_frame {
            self.lowpass_applier = None;
        }

        Some(result)
    }

    #[inline]
    fn size_hint(&self) -> (usize, Option<usize>) {
        self.input.size_hint()
    }
}

impl<I> ExactSizeIterator for MusicEngineSource<I> where I: Source<Item = f32> + ExactSizeIterator {}

impl<I> Source for MusicEngineSource<I>
where
    I: Source<Item = f32>,
{
    #[inline]
    fn current_frame_len(&self) -> Option<usize> {
        self.input.current_frame_len()
    }

    #[inline]
    fn channels(&self) -> u16 {
        self.input.channels()
    }

    #[inline]
    fn sample_rate(&self) -> u32 {
        self.input.sample_rate()
    }

    #[inline]
    fn total_duration(&self) -> Option<Duration> {
        self.input.total_duration()
    }
}

#[derive(Clone, Debug)]
struct LowPassApplier {
    b0: f32,
    b1: f32,
    b2: f32,
    a1: f32,
    a2: f32,
}

impl LowPassApplier {
    fn new(freq: i32, sampling_frequency: u32) -> Self {
        let w0 = 2.0 * PI * freq as f32 / sampling_frequency as f32;
        let q = 0.5;

        let alpha = w0.sin() / (2.0 * q);
        let b1 = 1.0 - w0.cos();
        let b0 = b1 / 2.0;
        let b2 = b0;
        let a0 = 1.0 + alpha;
        let a1 = -2.0 * w0.cos();
        let a2 = 1.0 - alpha;

        LowPassApplier {
            b0: b0 / a0,
            b1: b1 / a0,
            b2: b2 / a0,
            a1: a1 / a0,
            a2: a2 / a0,
        }
    }

    #[inline]
    fn apply(&self, x_n: f32, x_n1: f32, x_n2: f32, y_n1: f32, y_n2: f32) -> f32 {
        self.b0 * x_n + self.b1 * x_n1 + self.b2 * x_n2 - self.a1 * y_n1 - self.a2 * y_n2
    }
}
