use crate::process::Version;

pub static SPELUNKY_EXE_1_47_MD5SUM: &str = "9f932e1fdcc53dad027e1a6c26878160";
pub(crate) static SPELUNKY_1_47_OFFSETS: Offsets = Offsets {
    kali_accepts: 0x112D20,
    global_state: 0x15446C,
    level_state: 0x154510,
};

pub static SPELUNKY_EXE_1_4_MD5SUM: &str = "185fd36d171fe1cb84425f6859ed9f32";
pub(crate) static SPELUNKY_1_4_OFFSETS: Offsets = Offsets {
    kali_accepts: 0x108BE4,
    global_state: 0x1384B4,
    level_state: 0x138558,
};

pub(crate) static KALI_ACCEPTS: &'static [u8; 26] = &[
    75, 0, 65, 0, 76, 0, 73, 0, 95, 0, 65, 0, 67, 0, 67, 0, 69, 0, 80, 0, 84, 0, 83, 0, 0, 0,
];
pub(crate) static EXE_NAME: &'static [i8; 13] = &[
    'S' as i8, 'p' as i8, 'e' as i8, 'l' as i8, 'u' as i8, 'n' as i8, 'k' as i8, 'y' as i8,
    '.' as i8, 'e' as i8, 'x' as i8, 'e' as i8, '\0' as i8,
];

pub struct Offsets {
    pub kali_accepts: usize,
    pub global_state: usize,
    pub level_state: usize,
}

impl Offsets {
    pub(crate) fn get_offsets_by_version(version: &Version) -> &'static Offsets {
        match version {
            Version::Spelunky14 => &SPELUNKY_1_4_OFFSETS,
            Version::Spelunky147 => &SPELUNKY_1_47_OFFSETS,
        }
    }
}
