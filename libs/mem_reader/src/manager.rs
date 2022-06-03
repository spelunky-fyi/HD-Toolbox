use std::collections::HashSet;
use std::io::Cursor;
use std::io::Seek;
use std::io::SeekFrom;
use std::time::Duration;

use byteorder::ByteOrder;
use byteorder::ReadBytesExt;
use byteorder::LE;
use log::{debug, info};
use serde::Serialize;
use tokio::select;
use tokio::sync::{mpsc, oneshot};
use tokio::time::interval;
use tokio::time::Instant;
use tokio::time::MissedTickBehavior;

use crate::process::ReadMemoryError;
use crate::process::{Failure, Process};

#[derive(Debug, Serialize, Clone, Default, PartialEq, Eq)]
pub struct MemoryUpdaterPayload {
    // This is stored as a float but that breaks equality.
    // Normal    - 1.0 (0x3F800000)
    // Slow Look - 0.2 (0x3E4CCCCD)
    camera_speed: u32,

    chars: [u32; 16],
}

impl MemoryUpdaterPayload {
    fn from_process(process: &Process) -> Result<Self, Failure> {
        let base_addr = process.base_addr;
        let other_state_offset =
            process.read_u32(base_addr + process.offsets.other_state)? as usize;
        let global_state_offset =
            process.read_u32(base_addr + process.offsets.global_state)? as usize;

        let mut chars_cursor =
            Cursor::new(process.read_n_bytes(global_state_offset + 0x4459c8 + 0xa24, 16 * 4)?);

        let chars = [
            chars_cursor
                .read_u32::<LE>()
                .map_err(|_| ReadMemoryError::Failed)?,
            chars_cursor
                .read_u32::<LE>()
                .map_err(|_| ReadMemoryError::Failed)?,
            chars_cursor
                .read_u32::<LE>()
                .map_err(|_| ReadMemoryError::Failed)?,
            chars_cursor
                .read_u32::<LE>()
                .map_err(|_| ReadMemoryError::Failed)?,
            chars_cursor
                .read_u32::<LE>()
                .map_err(|_| ReadMemoryError::Failed)?,
            chars_cursor
                .read_u32::<LE>()
                .map_err(|_| ReadMemoryError::Failed)?,
            chars_cursor
                .read_u32::<LE>()
                .map_err(|_| ReadMemoryError::Failed)?,
            chars_cursor
                .read_u32::<LE>()
                .map_err(|_| ReadMemoryError::Failed)?,
            chars_cursor
                .read_u32::<LE>()
                .map_err(|_| ReadMemoryError::Failed)?,
            chars_cursor
                .read_u32::<LE>()
                .map_err(|_| ReadMemoryError::Failed)?,
            chars_cursor
                .read_u32::<LE>()
                .map_err(|_| ReadMemoryError::Failed)?,
            chars_cursor
                .read_u32::<LE>()
                .map_err(|_| ReadMemoryError::Failed)?,
            chars_cursor
                .read_u32::<LE>()
                .map_err(|_| ReadMemoryError::Failed)?,
            chars_cursor
                .read_u32::<LE>()
                .map_err(|_| ReadMemoryError::Failed)?,
            chars_cursor
                .read_u32::<LE>()
                .map_err(|_| ReadMemoryError::Failed)?,
            chars_cursor
                .read_u32::<LE>()
                .map_err(|_| ReadMemoryError::Failed)?,
        ];

        Ok(Self {
            camera_speed: process.read_u32(other_state_offset + 0x38)?,
            chars,
        })
    }
}

#[derive(Debug, Serialize, Clone, PartialEq, Eq)]
pub enum AutoFixerState {
    NoSlowLook,
    SlowLookWaiting,
    SlowLookFixed,
}

impl Default for AutoFixerState {
    fn default() -> Self {
        AutoFixerState::NoSlowLook
    }
}

#[derive(Debug, Serialize, Clone, Default, PartialEq, Eq)]
pub struct AutoFixerPayload {
    state: AutoFixerState,
}

impl AutoFixerPayload {
    fn from_process(process: &Process) -> Result<Self, Failure> {
        let base_addr = process.base_addr;
        let other_state_offset =
            process.read_u32(base_addr + process.offsets.other_state)? as usize;
        let camera_speed = process.read_u32(other_state_offset + 0x38)?;

        if camera_speed == 0x3F800000 {
            return Ok(Self {
                state: AutoFixerState::NoSlowLook,
            });
        }

        let global_state_offset =
            process.read_u32(base_addr + process.offsets.global_state)? as usize;
        let screen_state = process.read_u32(global_state_offset + 0x58)? as usize;

        // Gameplay Screen States
        if screen_state <= 11 {
            return Ok(Self {
                state: AutoFixerState::SlowLookWaiting,
            });
        }

        let mut bytes = vec![0; 4];
        LE::write_u32(&mut bytes, 0x3F800000);

        process.write_n_bytes(other_state_offset + 0x38, bytes)?;

        // PayloadResponse::Success
        Ok(Self {
            state: AutoFixerState::SlowLookFixed,
        })
    }
}

#[derive(Debug, Serialize, Clone, PartialEq, Eq)]
pub enum Ownership {
    Unowned,
    HiredHand,
    Player1,
    Player2,
    Player3,
    Player4,
    Unknown(i32),
}

impl Default for Ownership {
    fn default() -> Self {
        Self::Unowned
    }
}

impl From<i32> for Ownership {
    fn from(value: i32) -> Self {
        match value {
            -99 => Self::Unowned,
            -1 => Self::HiredHand,
            0 => Self::Player1,
            1 => Self::Player2,
            2 => Self::Player3,
            3 => Self::Player4,
            _ => Self::Unknown(value),
        }
    }
}

#[derive(Debug, Serialize, Clone, PartialEq, Eq)]
pub enum EntityKind {
    Entity,
    Floor,
    Active,
    Player,
    Monster,
    Item,
    Background,
    Explosion,
    Unknown(i32),
}

impl Default for EntityKind {
    fn default() -> Self {
        Self::Entity
    }
}

impl From<i32> for EntityKind {
    fn from(value: i32) -> Self {
        match value {
            -99 => Self::Entity,
            0 => Self::Floor,
            1 => Self::Active,
            2 => Self::Player,
            3 => Self::Monster,
            4 => Self::Item,
            5 => Self::Background,
            6 => Self::Explosion,
            _ => Self::Unknown(value),
        }
    }
}

#[derive(Debug, Serialize, Clone, PartialEq, Eq)]
pub enum ScreenState {
    Running,
    Loading1,
    Loading2,
    Loading3,
    PauseMenu,
    TitleScreen,
    Leaderboards,
    HelpAndOptions,
    LevelCompleted,
    Intro,
    MainMenu,
    ChooseCharacter,
    VictoryWalking,
    VictoryEruption,
    VictoryOutside,
    PlayerStats,
    OpeningScreen,
    DeathmatchArena,
    DeathmatchMenu,
    Tutorial,
    DeathmatchConfig,
    DeathmatchResults,
    Journal,
    DeathScreen,
    Credits,
    Unknown(i32),
}

impl Default for ScreenState {
    fn default() -> Self {
        Self::Running
    }
}

impl From<i32> for ScreenState {
    fn from(value: i32) -> Self {
        match value {
            0 => Self::Running,
            1 => Self::Loading1,
            2 => Self::Loading2,
            3 => Self::Loading3,
            4 => Self::PauseMenu,
            5 => Self::TitleScreen,
            7 => Self::Leaderboards,
            8 => Self::HelpAndOptions,
            11 => Self::LevelCompleted,
            14 => Self::Intro,
            15 => Self::MainMenu,
            17 => Self::ChooseCharacter,
            18 => Self::VictoryWalking,
            19 => Self::VictoryEruption,
            20 => Self::VictoryOutside,
            21 => Self::PlayerStats,
            22 => Self::OpeningScreen,
            23 => Self::DeathmatchArena,
            25 => Self::DeathmatchMenu,
            26 => Self::Tutorial,
            27 => Self::DeathmatchConfig,
            28 => Self::DeathmatchResults,
            29 => Self::Journal,
            30 => Self::DeathScreen,
            31 => Self::Credits,
            _ => Self::Unknown(value),
        }
    }
}

#[derive(Debug, Serialize, Clone, PartialEq, Eq)]
pub enum PlayState {
    None,
    UsingAnkh,

    Unknown(i32),
}

impl Default for PlayState {
    fn default() -> Self {
        Self::None
    }
}

impl From<i32> for PlayState {
    fn from(value: i32) -> Self {
        match value {
            0 => Self::None,
            35 => Self::UsingAnkh,

            _ => Self::Unknown(value),
        }
    }
}

#[derive(Debug, Serialize, Clone, PartialEq, Eq, Hash)]
pub enum EntityType {
    Player,
    ShotgunPellet,
    Eggplant,

    Spectacles,
    ClimbingGloves,
    PitchersMitt,
    SpringShoes,
    SpikeShoes,
    BombPaste,
    Compass,
    Mattock,
    Boomerang,
    Machete,
    Crysknife,
    WebGun,
    Shotgun,
    FreezeRay,
    PlasmaCannon,
    Camera,
    Teleporter,
    Parachute,
    Cape,
    Jetpack,
    Shield,
    RoyalJelly,
    Idol,
    Kapala,
    UdjatEye,
    Ankh,
    Hedjet,
    Sceptre,
    BookOfTheDead,
    VladsCape,
    VladsAmulet,

    Unknown(i32),
}

impl Default for EntityType {
    fn default() -> Self {
        Self::Player
    }
}

impl From<i32> for EntityType {
    fn from(value: i32) -> Self {
        match value {
            0 => Self::Player,
            117 => Self::ShotgunPellet,
            252 => Self::Eggplant,
            503 => Self::Spectacles,
            504 => Self::ClimbingGloves,
            505 => Self::PitchersMitt,
            506 => Self::SpringShoes,
            507 => Self::SpikeShoes,
            508 => Self::BombPaste,
            509 => Self::Compass,
            510 => Self::Mattock,
            511 => Self::Boomerang,
            512 => Self::Machete,
            513 => Self::Crysknife,
            514 => Self::WebGun,
            515 => Self::Shotgun,
            516 => Self::FreezeRay,
            517 => Self::PlasmaCannon,
            518 => Self::Camera,
            519 => Self::Teleporter,
            520 => Self::Parachute,
            521 => Self::Cape,
            522 => Self::Jetpack,
            523 => Self::Shield,
            524 => Self::RoyalJelly,
            525 => Self::Idol,
            526 => Self::Kapala,
            527 => Self::UdjatEye,
            528 => Self::Ankh,
            529 => Self::Hedjet,
            530 => Self::Sceptre,
            531 => Self::BookOfTheDead,
            532 => Self::VladsCape,
            533 => Self::VladsAmulet,
            _ => Self::Unknown(value),
        }
    }
}

#[derive(Debug, Serialize, Clone, Default, PartialEq, Eq)]
pub struct PartialEntity {
    pub entity_kind: EntityKind,
    pub entity_type: EntityType,
    pub owner: Ownership,
}

#[derive(Debug, Serialize, Clone, PartialEq, Eq, Hash)]
pub enum Input {
    None,
    Left,
    Right,
    Up,
    Down,
    Whip,
    Jump,
    Bomb,
    Rope,
    Run,
    PurchaseDoor,
}

impl Default for Input {
    fn default() -> Self {
        Self::None
    }
}
#[derive(Debug, Serialize, Clone, Default, PartialEq, Eq)]
pub struct GameState {
    pub screen_state: ScreenState,
    pub play_state: PlayState,
    pub level: u32,

    pub total_time_ms: u64,

    pub is_haunted_castle: bool,
    pub moai_spawned: bool,
    pub is_black_market: bool,
    pub is_mothership: bool,
    pub is_city_of_gold: bool,
    pub is_worm: bool,

    pub total_money: u32,
    pub respawn_level: u32,

    pub player_data: PlayerData,
    pub player_ducking: bool,
    pub player_ledge_grabbing: bool,
    pub player_held_entity: Option<PartialEntity>,

    pub inputs: HashSet<Input>,
    //pub active_entities: Vec<PartialEntity>,
}

#[derive(Debug, Serialize, Clone, PartialEq, Eq)]
pub enum CategoryTrackerPayload {
    NoPlayers(ScreenState),

    // Returned when multiple players are detected.
    // Not valid for Category Tracker.
    Multiplayer,

    // Returned outside of scenes where we normally do any processing
    InactiveScreenState(ScreenState),

    GameState(GameState),

    Dead,
}

impl Default for CategoryTrackerPayload {
    fn default() -> Self {
        Self::InactiveScreenState(ScreenState::Running)
    }
}

const ACTIVE_SCENES: &[ScreenState] = &[
    ScreenState::Running,
    ScreenState::Loading1,
    ScreenState::Loading2,
    ScreenState::Loading3,
    ScreenState::LevelCompleted,
    ScreenState::VictoryWalking,
    ScreenState::VictoryEruption,
    ScreenState::VictoryOutside,
    ScreenState::Tutorial,
    ScreenState::DeathScreen,
];

fn get_inputs(
    process: &Process,
    global_state_offset: usize,
    active_player: usize,
) -> Result<HashSet<Input>, Failure> {
    let mut inputs = HashSet::new();

    let controls_offset = process.read_u32(global_state_offset + 0x40)? as usize;
    let player_inputs = process.read_n_bytes(controls_offset + active_player * 152, 33 * 4)?;

    let action_offsets: &[u32] = &[0, 1, 2, 3, 4, 5, 12, 13];
    let input_types = [
        (0x24, Input::Whip),
        (0x28, Input::Jump),
        (0x2c, Input::Bomb),
        (0x30, Input::Rope),
        (0x34, Input::Run),
        (0x38, Input::PurchaseDoor),
    ];

    for (offset, input_type) in input_types {
        let action_key = LE::read_u32(&player_inputs[offset..offset + 4]);
        let offset = action_offsets[action_key as usize];
        if player_inputs[offset as usize] >= 1 {
            inputs.insert(input_type);
        }
    }

    let x_axis = LE::read_i32(&player_inputs[0x1c..0x1c + 4]);
    if x_axis > 0x14 {
        inputs.insert(Input::Right);
    } else if x_axis < -0x14 {
        inputs.insert(Input::Left);
    }

    let y_axis = LE::read_i32(&player_inputs[0x20..0x20 + 4]);
    if y_axis > 0x14 {
        inputs.insert(Input::Up);
    } else if y_axis < -12 {
        inputs.insert(Input::Down);
    }

    Ok(inputs)
}

fn _get_active_entities(
    process: &Process,
    global_state_offset: usize,
) -> Result<Vec<PartialEntity>, Failure> {
    let entity_struct_offset = process.read_u32(global_state_offset + 0x30)? as usize;
    let num_active_entities = process.read_u32(entity_struct_offset + 0x7810)? as usize;
    let mut active_entities = Vec::with_capacity(num_active_entities);

    let mut entity_ptrs =
        Cursor::new(process.read_n_bytes(entity_struct_offset, 4 * num_active_entities)?);
    for _ in 0..num_active_entities {
        let ptr = entity_ptrs
            .read_u32::<LE>()
            .map_err(|_| ReadMemoryError::Failed)? as usize;

        if let Some(partial_entity) = get_partial_entity(process, ptr)? {
            // if owner == Ownership::Unowned || owner == Ownership::HiredHand {
            //     continue;
            // }
            active_entities.push(partial_entity);
        }
    }

    Ok(active_entities)
}

fn get_partial_entity(process: &Process, addr: usize) -> Result<Option<PartialEntity>, Failure> {
    if addr == 0 {
        return Ok(None);
    }
    let mut entity_data = Cursor::new(process.read_n_bytes(addr + 0x8, 20)?);
    let entity_kind = entity_data
        .read_i32::<LE>()
        .map_err(|_| ReadMemoryError::Failed)?
        .into();
    let entity_type = entity_data
        .read_i32::<LE>()
        .map_err(|_| ReadMemoryError::Failed)?
        .into();
    entity_data
        .seek(SeekFrom::Start(0x10))
        .map_err(|_| ReadMemoryError::Failed)?;
    let owner = entity_data
        .read_i32::<LE>()
        .map_err(|_| ReadMemoryError::Failed)?
        .into();

    Ok(Some(PartialEntity {
        entity_kind,
        entity_type,
        owner,
    }))
}

#[derive(Debug, Serialize, Clone, Default, PartialEq, Eq)]
pub struct PlayerData {
    pub health: u32,
    pub bombs: u32,
    pub ropes: u32,
    pub has_item: HashSet<EntityType>,

    pub hh_count: u32,
    pub hh_held_item_ids: [EntityType; 8],

    pub held_item: EntityType,
    pub total_kills: u32,
}

fn get_player_data(process: &Process, addr: usize) -> Result<PlayerData, Failure> {
    let player_data = process.read_n_bytes(addr, 0x14a4)?;

    let hh_held_item_ids: [EntityType; 8] = [
        LE::read_i32(&player_data[0x44..0x44 + 4]).into(),
        LE::read_i32(&player_data[0x48..0x48 + 4]).into(),
        LE::read_i32(&player_data[0x4c..0x4c + 4]).into(),
        LE::read_i32(&player_data[0x50..0x50 + 4]).into(),
        LE::read_i32(&player_data[0x54..0x54 + 4]).into(),
        LE::read_i32(&player_data[0x58..0x58 + 4]).into(),
        LE::read_i32(&player_data[0x5c..0x5c + 4]).into(),
        LE::read_i32(&player_data[0x60..0x60 + 4]).into(),
    ];

    let player_items = [
        (0x70, EntityType::Compass),
        (0x71, EntityType::Parachute),
        (0x72, EntityType::Jetpack),
        (0x73, EntityType::ClimbingGloves),
        (0x74, EntityType::PitchersMitt),
        (0x75, EntityType::SpringShoes),
        (0x76, EntityType::SpikeShoes),
        (0x77, EntityType::Spectacles),
        (0x78, EntityType::Kapala),
        (0x79, EntityType::Hedjet),
        (0x7a, EntityType::UdjatEye),
        (0x7b, EntityType::BookOfTheDead),
        (0x7c, EntityType::Ankh),
        (0x7d, EntityType::BombPaste),
        (0x7e, EntityType::Cape),
        (0x7f, EntityType::VladsCape),
        (0x80, EntityType::Crysknife),
        (0x81, EntityType::VladsAmulet),
    ];
    let mut has_item = HashSet::new();
    for (offset, entity) in player_items {
        if player_data[offset] > 0 {
            has_item.insert(entity);
        }
    }

    Ok(PlayerData {
        health: LE::read_u32(&player_data[0..4]),
        bombs: LE::read_u32(&player_data[0x10..0x10 + 4]),
        ropes: LE::read_u32(&player_data[0x14..0x14 + 4]),
        has_item,

        hh_count: LE::read_u32(&player_data[0x20..0x20 + 4]),
        hh_held_item_ids,

        held_item: LE::read_i32(&player_data[0x88..0x88 + 4]).into(),
        total_kills: LE::read_u32(&player_data[0x90..0x90 + 4]),
    })
}

impl CategoryTrackerPayload {
    fn from_process(process: &Process) -> Result<Self, Failure> {
        let base_addr = process.base_addr;
        // let other_state_offset =
        //     process.read_u32(base_addr + process.offsets.other_state)? as usize;
        let global_state_offset =
            process.read_u32(base_addr + process.offsets.global_state)? as usize;

        let mut players_offset =
            Cursor::new(process.read_n_bytes(global_state_offset + 0x440684, 4 * 4)?);

        let screen_state = process.read_i32(global_state_offset + 0x58)?.into();
        if screen_state == ScreenState::DeathScreen {
            return Ok(Self::Dead);
        }

        let play_state = process.read_i32(global_state_offset + 0x5c)?.into();

        let mut player = None;
        let mut active_player = 0;
        for i in 0..4 {
            let potential_player = players_offset
                .read_u32::<LE>()
                .map_err(|_| ReadMemoryError::Failed)?;
            if potential_player == 0 {
                continue;
            }

            if !player.is_none() {
                return Ok(Self::Multiplayer);
            }

            player = Some(potential_player);
            active_player = i;
        }

        let player_ptr = match player {
            None => {
                // If we're in an active scene but there's no players
                // just return inactive scene so the runstate stops processing
                // temporarily.
                if ACTIVE_SCENES.contains(&screen_state) {
                    return Ok(Self::InactiveScreenState(screen_state));
                }
                return Ok(Self::NoPlayers(screen_state));
            }
            Some(player) => player,
        } as usize;
        let player_data_offset = global_state_offset + (0x440694 + (0x14a4 * active_player));
        let player_data = get_player_data(process, player_data_offset)?;
        let player_ducking = process.read_u8(player_ptr + 0x206)? != 0;
        let player_ledge_grabbing = process.read_u8(player_ptr + 0x207)? != 0;
        let player_held_entity =
            get_partial_entity(process, process.read_u32(player_ptr + 0x234)? as usize)?;

        if !ACTIVE_SCENES.contains(&screen_state) {
            return Ok(Self::InactiveScreenState(screen_state));
        }

        let level = process.read_u32(global_state_offset + 0x4405D4)?;
        let is_haunted_castle = process.read_u8(global_state_offset + 0x4405F7)? != 0;
        let moai_spawned = process.read_u8(global_state_offset + 0x4405FE)? != 0;
        let is_black_market = process.read_u8(global_state_offset + 0x4405FF)? != 0;
        let is_mothership = process.read_u8(global_state_offset + 0x440602)? != 0;
        let is_city_of_gold = process.read_u8(global_state_offset + 0x440604)? != 0;
        let is_worm = process.read_u8(global_state_offset + 0x440606)? != 0;

        let total_minutes = process.read_u32(global_state_offset + 0x445940)?;
        let total_seconds = process.read_u32(global_state_offset + 0x445944)?;
        let total_ms = process.read_f64(global_state_offset + 0x445948)?;
        let mut total_time_ms: u64 = total_minutes as u64 * 60 * 1000;
        total_time_ms += total_seconds as u64 * 1000;
        total_time_ms += total_ms.trunc() as u64;

        let total_money = process.read_u32(global_state_offset + 0x44592C)?;
        let respawn_level = process.read_u32(global_state_offset + 0x44734C)?;

        Ok(Self::GameState(GameState {
            screen_state,
            play_state,
            level,

            is_haunted_castle,
            moai_spawned,
            is_black_market,
            is_mothership,
            is_city_of_gold,
            is_worm,

            total_time_ms,
            total_money,
            respawn_level,

            player_ducking,
            player_ledge_grabbing,
            player_held_entity,

            player_data,

            inputs: get_inputs(process, global_state_offset, active_player)?,
        }))
    }
}

#[derive(Debug, Serialize, Clone, Default, PartialEq, Eq)]
pub struct PacifistTrackerPayload {
    pub total_kills: u32,
}

impl PacifistTrackerPayload {
    fn from_process(process: &Process) -> Result<Self, Failure> {
        let global_state =
            process.read_u32(process.base_addr + process.offsets.global_state)? as usize;

        let mut total_kills: u32 = 0;

        total_kills = total_kills.wrapping_add(process.read_u32(global_state + 0x440694 + 0x90)?);
        total_kills = total_kills.wrapping_add(process.read_u32(global_state + 0x441B38 + 0x90)?);
        total_kills = total_kills.wrapping_add(process.read_u32(global_state + 0x442FDC + 0x90)?);
        total_kills = total_kills.wrapping_add(process.read_u32(global_state + 0x444480 + 0x90)?);

        Ok(Self { total_kills })
    }
}

#[derive(Debug)]
pub enum PayloadRequest {
    MemoryUpdater,
    AutoFixer,
    CategoryTracker,
    PacifistTracker,

    FixSlowLook,
    SetCharacter(usize, u32),
}

#[derive(Debug, Serialize, Clone, PartialEq, Eq)]
#[serde(tag = "type", content = "data")]
pub enum PayloadResponse {
    MemoryUpdater(MemoryUpdaterPayload),
    AutoFixer(AutoFixerPayload),
    CategoryTracker(CategoryTrackerPayload),
    PacifistTracker(PacifistTrackerPayload),
    Failure(Failure),

    // Empty sucess response
    Success,
}

#[derive(Debug)]
enum ManagerMessage {
    Connect(oneshot::Sender<Result<(), Failure>>),
    GetPayload(PayloadRequest, oneshot::Sender<PayloadResponse>),
    Shutdown(oneshot::Sender<()>),
    Attached(oneshot::Sender<bool>),
}

pub struct Manager {
    handle_tx: mpsc::Sender<ManagerMessage>,
    handle_rx: mpsc::Receiver<ManagerMessage>,
    shutdown_tx: Option<oneshot::Sender<()>>,
    process: Option<Process>,
    last_request: Instant,
}

impl Manager {
    pub fn new() -> Self {
        let (handle_tx, handle_rx) = mpsc::channel::<ManagerMessage>(100);
        Self {
            handle_tx,
            handle_rx,
            shutdown_tx: None,
            process: None,
            last_request: Instant::now(),
        }
    }

    pub fn get_handle(&self) -> ManagerHandle {
        ManagerHandle {
            handle_tx: self.handle_tx.clone(),
        }
    }

    pub async fn run_forever(&mut self) {
        debug!("Running Memory Manager!");
        let mut poll_interval = interval(Duration::from_secs(1));
        poll_interval.set_missed_tick_behavior(MissedTickBehavior::Delay);
        let (shutdown_tx, mut shutdown_rx) = oneshot::channel();
        self.shutdown_tx = Some(shutdown_tx);

        loop {
            select! {
                _ = &mut shutdown_rx => {
                    debug!("Shutting down Memory Manager!");
                    break;
                }
                _ = poll_interval.tick() => {
                    if Instant::now() - self.last_request > Duration::from_secs(10) {
                        if let Some(_) = self.process.take() {
                            info!("Closing process due to lack of requests...")
                        }
                    }
                }
                msg = self.handle_rx.recv() => {
                    if let Some(msg) = msg {
                        self.handle_msg(msg).await;
                    }
                }
            }
        }
    }

    fn ensure_connected(&mut self) -> Result<(), Failure> {
        self.last_request = Instant::now();
        if self.process.is_none() {
            match Process::new() {
                Ok(process) => self.process = Some(process),
                Err(err) => {
                    return Err(err.into());
                }
            }
        }
        Ok(())
    }

    async fn handle_msg(&mut self, msg: ManagerMessage) {
        match msg {
            ManagerMessage::Connect(response) => {
                self.handle_connect(response);
            }
            ManagerMessage::GetPayload(request, response) => {
                self.handle_get_payload(request, response);
            }
            ManagerMessage::Shutdown(response) => {
                self.handle_shutdown(response);
            }
            ManagerMessage::Attached(response) => {
                self.handle_attached(response);
            }
        };
    }

    fn handle_connect(&mut self, response: oneshot::Sender<Result<(), Failure>>) {
        let _ = response.send(self.ensure_connected());
    }

    fn handle_get_payload(
        &mut self,
        request: PayloadRequest,
        response: oneshot::Sender<PayloadResponse>,
    ) {
        if let Err(err) = self.ensure_connected() {
            let _ = response.send(PayloadResponse::Failure(err));
            return;
        }

        if let Some(process) = &self.process {
            let payload_response = match request {
                PayloadRequest::MemoryUpdater => {
                    match MemoryUpdaterPayload::from_process(process) {
                        Ok(payload) => PayloadResponse::MemoryUpdater(payload),
                        Err(err) => PayloadResponse::Failure(err),
                    }
                }
                PayloadRequest::AutoFixer => match AutoFixerPayload::from_process(process) {
                    Ok(payload) => PayloadResponse::AutoFixer(payload),
                    Err(err) => PayloadResponse::Failure(err),
                },
                PayloadRequest::CategoryTracker => {
                    match CategoryTrackerPayload::from_process(process) {
                        Ok(payload) => PayloadResponse::CategoryTracker(payload),
                        Err(err) => PayloadResponse::Failure(err),
                    }
                }
                PayloadRequest::PacifistTracker => {
                    match PacifistTrackerPayload::from_process(process) {
                        Ok(payload) => PayloadResponse::PacifistTracker(payload),
                        Err(err) => PayloadResponse::Failure(err),
                    }
                }
                PayloadRequest::FixSlowLook => {
                    let mut bytes = vec![0; 4];
                    LE::write_u32(&mut bytes, 0x3F800000);

                    let base_addr = process.base_addr;
                    let other_state_offset =
                        match process.read_u32(base_addr + process.offsets.other_state) {
                            Ok(offset) => offset,
                            Err(err) => {
                                let _ = response.send(PayloadResponse::Failure(err.into()));
                                return;
                            }
                        } as usize;

                    if let Err(err) = process.write_n_bytes(other_state_offset + 0x38, bytes) {
                        let _ = response.send(PayloadResponse::Failure(err.into()));
                        return;
                    }

                    PayloadResponse::Success
                }
                PayloadRequest::SetCharacter(index, value) => {
                    if index > 15 {
                        let _ = response.send(PayloadResponse::Failure(Failure::Unknown(
                            "Invalid Index".into(),
                        )));
                        return;
                    }

                    if value != 0 && value != 1 {
                        let _ = response.send(PayloadResponse::Failure(Failure::Unknown(
                            "Invalid Value".into(),
                        )));
                        return;
                    }

                    let mut bytes = vec![0; 4];
                    LE::write_u32(&mut bytes, value);

                    let base_addr = process.base_addr;
                    let global_state_offset =
                        match process.read_u32(base_addr + process.offsets.global_state) {
                            Ok(offset) => offset,
                            Err(err) => {
                                let _ = response.send(PayloadResponse::Failure(err.into()));
                                return;
                            }
                        } as usize;

                    let char_offset = global_state_offset + 0x4459c8 + 0xa24 + (index * 4);
                    if let Err(err) = process.write_n_bytes(char_offset, bytes) {
                        let _ = response.send(PayloadResponse::Failure(err.into()));
                        return;
                    }

                    PayloadResponse::Success
                }
            };

            if let PayloadResponse::Failure(_) = &payload_response {
                self.process = None;
            }
            let _ = response.send(payload_response);
        }
    }

    fn handle_shutdown(&mut self, response: oneshot::Sender<()>) {
        if let Some(tx) = self.shutdown_tx.take() {
            let _ = tx.send(());
        }
        let _ = response.send(());
    }

    fn handle_attached(&mut self, response: oneshot::Sender<bool>) {
        let _ = response.send(self.process.is_some());
    }
}

#[derive(Clone)]
pub struct ManagerHandle {
    handle_tx: mpsc::Sender<ManagerMessage>,
}

impl ManagerHandle {
    pub async fn connect(&self) -> anyhow::Result<()> {
        let (tx, rx) = oneshot::channel();
        self.handle_tx.send(ManagerMessage::Connect(tx)).await?;

        Ok(rx.await??)
    }

    pub async fn get_payload(&self, request: PayloadRequest) -> anyhow::Result<PayloadResponse> {
        let (tx, rx) = oneshot::channel();
        self.handle_tx
            .send(ManagerMessage::GetPayload(request, tx))
            .await?;

        Ok(rx.await?)
    }

    pub async fn shutdown(&self) -> anyhow::Result<()> {
        let (tx, rx) = oneshot::channel();
        self.handle_tx.send(ManagerMessage::Shutdown(tx)).await?;
        Ok(rx.await?)
    }

    pub async fn attached(&self) -> anyhow::Result<bool> {
        let (tx, rx) = oneshot::channel();
        self.handle_tx.send(ManagerMessage::Attached(tx)).await?;
        Ok(rx.await?)
    }
}
