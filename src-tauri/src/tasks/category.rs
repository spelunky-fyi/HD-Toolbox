use std::collections::HashSet;

use async_trait::async_trait;

use hdt_cat_labels::{Label, LabelType, RunLabels, TerminusLabel};
use hdt_mem_reader::manager::{
    CategoryTrackerPayload, EntityType, GameState, Input, ManagerHandle, PayloadResponse,
    PlayState, ScreenState,
};
use serde::Serialize;

use crate::config::CategoryConfig;

use super::tracker_task::TrackerTicker;
use super::trackers::Response;

#[derive(Debug, Serialize, Clone, PartialEq, Eq)]
pub struct CategoryResponse {
    category: String,
}

struct RunState {
    run_labels: RunLabels,

    is_low_percent: bool,
    level_started: bool,
    level_start_ropes: u32,

    got_ankh: bool,
    got_hedjet: bool,
    got_book_of_the_dead: bool,

    visit_black_market: bool,
    visit_haunted_castle: bool,
    visit_mothership: bool,
    visit_city_of_gold: bool,
    visit_worm: bool,

    is_shield: bool,
    is_eggy: bool,

    hell_failed: bool,
    max_failed: bool,
    failed_low_if_not_hell: bool,
}

impl Default for RunState {
    fn default() -> Self {
        Self {
            run_labels: RunLabels::default(),

            is_low_percent: true,
            level_started: false,
            level_start_ropes: 4,

            got_ankh: false,
            got_hedjet: false,
            got_book_of_the_dead: false,

            visit_black_market: false,
            visit_haunted_castle: false,
            visit_mothership: false,
            visit_city_of_gold: false,
            visit_worm: false,

            is_shield: false,
            is_eggy: false,

            hell_failed: false,
            max_failed: false,
            failed_low_if_not_hell: false,
        }
    }
}

impl RunState {
    fn with_run_labels(run_labels: RunLabels) -> Self {
        Self {
            run_labels,
            ..Default::default()
        }
    }

    fn update(&mut self, prev_gamestate: &GameState, gamestate: &GameState) {
        self.update_on_level_start(prev_gamestate, gamestate);
        self.update_no_gold(gamestate);
        self.update_pacifist(gamestate);
        self.update_starting_resources(prev_gamestate, gamestate);
        self.update_has_item(gamestate);
        self.update_held_item(gamestate);
        self.update_used_item(gamestate);
        self.update_no_transition(gamestate);
        self.update_visited(gamestate);
        self.update_hell(gamestate);
        self.update_max(gamestate);

        self.process_victory(gamestate);
    }

    fn update_on_level_start(&mut self, prev_gamestate: &GameState, gamestate: &GameState) {
        if prev_gamestate.level != gamestate.level {
            self.level_started = true;
        } else {
            self.level_started = false;
        }

        if !self.level_started {
            return;
        }

        self.level_start_ropes = gamestate.player_data.ropes;
        // Only check at the start of levels to give a chance to reclaim monkey ropes
        if gamestate.player_data.ropes < 4 {
            self.run_labels.rm_label(&Label::No);
        }
    }

    fn update_visited(&mut self, gamestate: &GameState) {
        if gamestate.is_black_market {
            self.visit_black_market = true;
        }

        if gamestate.is_haunted_castle {
            self.visit_haunted_castle = true;
            self.run_labels.add_label(Label::Haunted);
        }

        if gamestate.is_mothership {
            self.visit_mothership = true;
        }

        if gamestate.is_city_of_gold {
            self.visit_city_of_gold = true;
        }

        if gamestate.is_worm {
            self.visit_worm = true;
            self.run_labels.add_label(Label::Max);
        }
    }

    fn update_max(&mut self, gamestate: &GameState) {
        if self.max_failed {
            return;
        }

        if self.level_started {
            if gamestate.level == 10 && !self.visit_worm {
                self.fail_max();
            }

            if gamestate.level == 13 && !self.visit_mothership {
                self.fail_max();
            }
        }
    }
    fn update_hell(&mut self, gamestate: &GameState) {
        if self.hell_failed {
            return;
        }

        if self.level_started {
            // Last Level of Jungle
            if gamestate.level == 8 && !gamestate.is_black_market && !self.got_ankh {
                self.fail_hell();
            }

            // Start of Ice Caves
            if gamestate.level == 9 && !self.got_ankh {
                self.fail_hell();
            }

            // Last Level of Ice Caves
            if gamestate.level == 12 && !self.visit_worm && !self.got_hedjet {
                self.fail_hell();
            }

            // Start of Temple
            if gamestate.level == 13 && !self.got_hedjet {
                self.fail_hell();
            }

            // Temple 4-2
            if gamestate.level == 14 && !self.someone_holding(gamestate, EntityType::Sceptre) {
                self.fail_hell();
            }

            if gamestate.level == 15 && !gamestate.is_city_of_gold {
                self.fail_hell();
            }

            if gamestate.level == 16 && !self.got_book_of_the_dead {
                self.fail_hell();
            }
        }

        if gamestate.play_state == PlayState::UsingAnkh && !gamestate.moai_spawned {
            self.fail_hell();
        }
    }

    fn update_has_item(&mut self, gamestate: &GameState) {
        let low_hell_items = [
            EntityType::Ankh,
            EntityType::Hedjet,
            EntityType::BookOfTheDead,
        ];

        for item in &gamestate.player_data.has_item {
            if low_hell_items.contains(item) {
                self.failed_low_if_not_hell = true;
            } else {
                self.fail_low();
            }

            if !self.hell_failed {
                match item {
                    EntityType::UdjatEye => {
                        self.run_labels.set_terminus(TerminusLabel::Hell);
                    }
                    EntityType::Ankh => {
                        self.got_ankh = true;
                        self.run_labels.set_terminus(TerminusLabel::Hell);
                    }
                    EntityType::Hedjet => {
                        self.got_hedjet = true;
                        self.run_labels.set_terminus(TerminusLabel::Hell);
                    }
                    EntityType::BookOfTheDead => {
                        self.got_book_of_the_dead = true;
                        self.run_labels.set_terminus(TerminusLabel::Hell);
                    }
                    _ => {}
                }
            }
        }
    }

    fn update_held_item(&mut self, gamestate: &GameState) {
        if self.is_low_percent && gamestate.player_held_entity.entity_type == EntityType::Shield {
            self.fail_low();
        }

        if !self.hell_failed {
            match gamestate.player_held_entity.entity_type {
                EntityType::Shield => {
                    self.is_shield = true;
                    self.run_labels.add_label(Label::Shield);
                }
                EntityType::Eggplant => {
                    self.is_eggy = true;
                    self.run_labels.add_label(Label::Eggplant);
                }
                _ => {}
            }
        }

        if self.level_started {
            if self.is_shield && !self.someone_holding(gamestate, EntityType::Shield) {
                self.is_shield = false;
                self.run_labels.rm_label(&Label::Shield);
            }
            if self.is_eggy && !self.someone_holding(gamestate, EntityType::Eggplant) {
                self.is_eggy = false;
                self.run_labels.rm_label(&Label::Eggplant);
            }
        }
    }

    fn update_used_item(&mut self, gamestate: &GameState) {
        let banned_low_items = [
            EntityType::Mattock,
            EntityType::Boomerang,
            EntityType::Machete,
            EntityType::WebGun,
            EntityType::Shotgun,
            EntityType::FreezeRay,
            EntityType::PlasmaCannon,
            EntityType::Camera,
            EntityType::Teleporter,
            EntityType::Sceptre,
        ];

        println!("{:?}", &gamestate.player_held_entity);
        if banned_low_items.contains(&gamestate.player_held_entity.entity_type)
            && gamestate.inputs.contains(&Input::Whip)
            && !gamestate.player_ducking
            && !gamestate.player_ledge_grabbing
        {
            self.fail_low();
            if &gamestate.player_held_entity.entity_type == &EntityType::Teleporter {
                self.run_labels.rm_label(&Label::NoTeleporter);
            }
        }
    }

    fn update_no_transition(&mut self, gamestate: &GameState) {
        if gamestate.screen_state != ScreenState::LevelCompleted {
            return;
        }

        if gamestate.player_held_entity.entity_type == EntityType::Player {
            return;
        }

        self.run_labels.rm_label(&Label::No);
    }

    fn fail_hell(&mut self) {
        if self.hell_failed {
            return;
        }

        self.hell_failed = true;

        self.run_labels.rm_label(&Label::Eggplant);
        self.run_labels.rm_label(&Label::Shield);
        if !self.run_labels.terminus_requires_low() {
            self.run_labels.set_terminus(TerminusLabel::Any);
        }

        if self.failed_low_if_not_hell {
            self.fail_low();
        }
    }

    fn fail_max(&mut self) {
        if self.max_failed {
            return;
        }

        self.max_failed = true;
        self.run_labels.rm_label(&Label::Max);

        let current_terminus = self.run_labels.get_terminus().clone();
        if current_terminus == TerminusLabel::MaxIceCavesShortcut {
            self.run_labels.set_terminus(TerminusLabel::Invalid);
        }
    }

    fn someone_holding(&self, gamestate: &GameState, item: EntityType) -> bool {
        if gamestate.player_held_entity.entity_type == item {
            return true;
        }

        for hh_held_item in &gamestate.player_data.hh_held_item_ids {
            if hh_held_item == &item {
                return true;
            }
        }

        false
    }

    fn fail_low(&mut self) {
        if !self.is_low_percent {
            return;
        }

        self.is_low_percent = false;
        self.run_labels.rm_label(&Label::Low);
        self.run_labels.rm_label(&Label::No);

        if self.run_labels.terminus_requires_low() {
            self.run_labels.set_terminus(TerminusLabel::Invalid)
        }
    }

    fn update_starting_resources(&mut self, prev_gamestate: &GameState, gamestate: &GameState) {
        if !self.is_low_percent {
            return;
        }

        if gamestate.player_data.health > prev_gamestate.player_data.health
            && gamestate.play_state != PlayState::UsingAnkh
            || gamestate.player_data.health > 4
        {
            self.fail_low();
        }

        if gamestate.player_data.bombs > prev_gamestate.player_data.bombs
            || gamestate.player_data.bombs > 4
        {
            self.fail_low();
        }

        if gamestate.player_data.ropes > self.level_start_ropes || gamestate.player_data.ropes > 4 {
            self.fail_low();
        }

        let rope_diff =
            gamestate.player_data.ropes as i32 - prev_gamestate.player_data.ropes as i32;
        if rope_diff != 0 && rope_diff != -3 && rope_diff != 3 {
            self.run_labels.rm_label(&Label::No);
        }

        if gamestate.player_data.health < 4 || gamestate.player_data.bombs < 4 {
            self.run_labels.rm_label(&Label::No);
        }
    }

    fn process_victory(&mut self, gamestate: &GameState) {
        if ![
            ScreenState::VictoryWalking,
            ScreenState::VictoryEruption,
            ScreenState::VictoryOutside,
        ]
        .contains(&gamestate.screen_state)
        {
            return;
        }

        if gamestate.level == 16 {
            self.fail_hell();
        }

        self.update_ropes_end_of_run(gamestate);
    }

    fn update_ropes_end_of_run(&mut self, gamestate: &GameState) {
        if gamestate.player_data.ropes < 4 {
            self.run_labels.rm_label(&Label::No);
        }
    }

    fn process_death(&mut self, gamestate: &GameState) {
        // TODO: Handle Pacifist
        self.run_labels.set_terminus(TerminusLabel::Death);

        self.update_ropes_end_of_run(gamestate);
    }

    fn update_no_gold(&mut self, gamestate: &GameState) {
        if gamestate.total_money > 0 {
            self.run_labels.rm_label(&Label::NoGold);
            self.run_labels.rm_label(&Label::No);
        }
    }

    fn update_pacifist(&mut self, gamestate: &GameState) {
        // TODO: Handle Olmec
        if gamestate.player_data.total_kills > 0 {
            self.run_labels.rm_label(&Label::Pacifist);
        }
    }
}

pub struct CategoryTracker {
    memory_handle: ManagerHandle,

    prev_gamestate: Option<GameState>,
    curr_gamestate: Option<GameState>,

    run_state: RunState,
}

impl CategoryTracker {
    pub fn new(memory_handle: ManagerHandle) -> Self {
        Self {
            memory_handle,

            prev_gamestate: None,
            curr_gamestate: None,
            run_state: RunState::default(),
        }
    }

    fn should_show_modifiers(&self, config: &CategoryConfig) -> bool {
        if !config.hide_early {
            return true;
        }

        if let Some(game_state) = &self.curr_gamestate {
            if game_state.level > 2 {
                return true;
            }
        }

        return false;
    }

    fn get_excluded_labels(config: &CategoryConfig) -> HashSet<LabelType> {
        let mut excludes = HashSet::new();
        if !config.show_no {
            excludes.insert(LabelType::Label(Label::No));
        }
        if !config.show_no_gold {
            excludes.insert(LabelType::Label(Label::NoGold));
        }
        if !config.show_pacifist {
            excludes.insert(LabelType::Label(Label::Pacifist));
        }
        excludes
    }

    fn active_response(&mut self, config: &CategoryConfig) -> Response {
        let exclude_labels = Self::get_excluded_labels(config);
        Response::Category(CategoryResponse {
            category: self.run_state.run_labels.get_text(
                !self.should_show_modifiers(config),
                &exclude_labels,
                config.alt_names,
            ),
        })
    }

    fn process_game_state(&mut self, gamestate: GameState) {
        self.prev_gamestate = self.curr_gamestate.take();
        self.curr_gamestate = Some(gamestate);

        let prev_gamestate = match &self.prev_gamestate {
            None => return,
            Some(gamestate) => gamestate,
        };

        let gamestate = match &self.curr_gamestate {
            None => return,
            Some(gamestate) => gamestate,
        };

        if gamestate.total_time_ms < prev_gamestate.total_time_ms
            || gamestate.respawn_level != prev_gamestate.respawn_level
        {
            if gamestate.respawn_level == 8 {
                self.run_state = RunState::with_run_labels(RunLabels::new_max_ics())
            } else if gamestate.respawn_level == 12 {
                self.run_state = RunState::with_run_labels(RunLabels::new_temple_shortcut())
            } else {
                self.run_state = RunState::with_run_labels(RunLabels::default())
            }
            self.run_state.update(&gamestate, &gamestate);
        } else {
            self.run_state.update(&prev_gamestate, &gamestate);
        }
    }
}

#[async_trait]
impl TrackerTicker for CategoryTracker {
    type Config = CategoryConfig;

    async fn startup(&mut self) -> Option<Response> {
        if let Err(_) = self.memory_handle.connect().await {
            return Some(Response::Failure("Failed to connect to process.".into()));
        }
        None
    }

    async fn tick(&mut self, config: &Self::Config) -> Response {
        let payload = match self
            .memory_handle
            .get_payload(hdt_mem_reader::manager::PayloadRequest::CategoryTracker)
            .await
        {
            Err(err) => {
                return Response::Failure(err.to_string());
            }
            Ok(PayloadResponse::Failure(err)) => {
                return Response::Failure(err.to_string());
            }
            Ok(PayloadResponse::CategoryTracker(category_data)) => category_data,
            _ => panic!("Got unexpected response..."),
        };

        match payload {
            CategoryTrackerPayload::NoPlayers(_) => Response::Category(CategoryResponse {
                category: "Waiting for game...".into(),
            }),
            CategoryTrackerPayload::Multiplayer => Response::Category(CategoryResponse {
                category: "Multiplayer not supported...".into(),
            }),
            CategoryTrackerPayload::InactiveScreenState(_) => self.active_response(config),
            CategoryTrackerPayload::Dead => {
                if let Some(gamestate) = &self.curr_gamestate {
                    self.run_state.process_death(gamestate);
                }
                self.active_response(config)
            }
            CategoryTrackerPayload::GameState(gamestate) => {
                self.process_game_state(gamestate);
                self.active_response(config)
            }
        }
    }
}
