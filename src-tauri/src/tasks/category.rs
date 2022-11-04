use std::collections::HashSet;

use async_trait::async_trait;

use hdt_cat_labels::{Label, LabelType, RunLabels, TerminusLabel};
use hdt_mem_reader::manager::{
    CategoryTrackerPayload, EntityType, GameState, Input, ManagerHandle, PartialEntity,
    PayloadResponse, PlayState, ScreenState,
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

    chain_hell_started: bool,
    chain_hell_failed: bool,
    max_failed: bool,
    failed_low_if_not_chain_hell: bool,

    frames_since_down: u32,
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

            chain_hell_started: false,
            chain_hell_failed: false,
            max_failed: false,
            failed_low_if_not_chain_hell: false,

            frames_since_down: 0,
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
        self.update_down_state(gamestate);
        self.update_on_level_start(prev_gamestate, gamestate);
        self.update_chain_hell(gamestate);
        self.update_hell(gamestate);
        self.update_no_gold(gamestate);
        self.update_pacifist(gamestate);
        self.update_starting_resources(prev_gamestate, gamestate);
        self.update_has_item(gamestate);
        self.update_held_item(gamestate);
        self.update_used_item(prev_gamestate, gamestate);
        self.update_no_transition(gamestate);
        self.update_visited(gamestate);
        self.update_max(gamestate);

        self.process_victory(gamestate);
    }

    fn update_down_state(&mut self, gamestate: &GameState) {
        if Self::is_ducking(gamestate) || gamestate.inputs.contains(&Input::Down) {
            self.frames_since_down = 0
        } else {
            if self.frames_since_down == u32::MAX {
                return;
            }
            self.frames_since_down += 1
        }
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
        if gamestate.level > 16 {
            if self.chain_hell_failed {
                self.run_labels.add_label(Label::Bookskip)
            } else {
                self.run_labels.add_label(Label::Chain)
            }
            self.run_labels.set_terminus(TerminusLabel::Hell);
        }
    }

    fn update_chain_hell(&mut self, gamestate: &GameState) {
        if self.chain_hell_failed {
            return;
        }

        if self.level_started {
            // Last Level of Jungle
            if gamestate.level == 8 && !gamestate.is_black_market && !self.got_ankh {
                self.fail_chain_hell();
            }

            // Start of Ice Caves
            if gamestate.level == 9 && !self.got_ankh {
                self.fail_chain_hell();
            }

            // Last Level of Ice Caves
            if gamestate.level == 12 && !self.visit_worm && !self.got_hedjet {
                self.fail_chain_hell();
            }

            // Start of Temple
            if gamestate.level == 13 && !self.got_hedjet {
                self.fail_chain_hell();
            }

            // Temple 4-2
            if gamestate.level == 14 && !self.someone_holding(gamestate, EntityType::Sceptre) {
                self.fail_chain_hell();
            }

            if gamestate.level == 15 && !gamestate.is_city_of_gold {
                self.fail_chain_hell();
            }

            if gamestate.level == 16 && !self.got_book_of_the_dead {
                self.fail_chain_hell();
            }
        }

        if gamestate.play_state == PlayState::UsingAnkh && !gamestate.moai_spawned {
            self.fail_chain_hell();
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
                self.failed_low_if_not_chain_hell = true;
            } else {
                self.fail_low();
            }

            if !self.chain_hell_failed {
                match item {
                    EntityType::UdjatEye => {
                        self.chain_hell_started = true;
                        self.run_labels.add_label(Label::Chain);
                        self.run_labels.set_terminus(TerminusLabel::Hell);
                    }
                    EntityType::Ankh => {
                        self.got_ankh = true;
                        self.chain_hell_started = true;
                        self.run_labels.add_label(Label::Chain);
                        self.run_labels.set_terminus(TerminusLabel::Hell);
                    }
                    EntityType::Hedjet => {
                        self.got_hedjet = true;
                        self.chain_hell_started = true;
                        self.run_labels.add_label(Label::Chain);
                        self.run_labels.set_terminus(TerminusLabel::Hell);
                    }
                    EntityType::BookOfTheDead => {
                        self.got_book_of_the_dead = true;
                        self.chain_hell_started = true;
                        self.run_labels.add_label(Label::Chain);
                        self.run_labels.set_terminus(TerminusLabel::Hell);
                    }
                    _ => {}
                }
            }
        }
    }

    fn update_held_item(&mut self, gamestate: &GameState) {
        if self.is_victory(gamestate) {
            return;
        }

        if let Some(held_entity) = &gamestate.player_held_entity {
            if self.is_low_percent && held_entity.entity_type == EntityType::Shield {
                self.fail_low();
            }

            match held_entity.entity_type {
                EntityType::Shield => {
                    self.is_shield = true;
                    self.run_labels.add_label(Label::Shield);

                    if !self.chain_hell_failed {
                        if self.chain_hell_started {
                            self.run_labels.add_label(Label::Chain);
                        }
                        self.run_labels.rm_label(&Label::Bookskip);
                    } else {
                        self.run_labels.add_label(Label::Bookskip);
                        self.run_labels.rm_label(&Label::Chain);
                    }
                    self.run_labels.set_terminus(TerminusLabel::Hell);
                }
                EntityType::Eggplant => {
                    if !self.is_eggy {
                        self.is_eggy = true;
                        self.run_labels.add_label(Label::Eggplant);

                        if !self.chain_hell_failed {
                            if self.chain_hell_started {
                                self.run_labels.add_label(Label::Chain);
                            }
                            self.run_labels.rm_label(&Label::Bookskip);
                        } else {
                            self.run_labels.add_label(Label::Bookskip);
                            self.run_labels.rm_label(&Label::Chain);
                        }
                        self.run_labels.set_terminus(TerminusLabel::Hell);
                    }
                }
                _ => {}
            }
        }

        if self.level_started {
            if self.is_shield && !self.someone_holding(gamestate, EntityType::Shield) {
                self.is_shield = false;
                self.run_labels.rm_label(&Label::Shield);
                if self.chain_hell_failed || gamestate.level <= 16 {
                    self.run_labels.rm_label(&Label::Bookskip);
                    self.run_labels.rm_label(&Label::Chain);
                    self.run_labels.set_terminus(TerminusLabel::Any);
                }
            }
            if self.is_eggy && !self.someone_holding(gamestate, EntityType::Eggplant) {
                self.is_eggy = false;
                self.run_labels.rm_label(&Label::Eggplant);
                if self.chain_hell_failed || gamestate.level <= 16 {
                    self.run_labels.rm_label(&Label::Bookskip);
                    self.run_labels.rm_label(&Label::Chain);
                    self.run_labels.set_terminus(TerminusLabel::Any);
                }
            }
        }
    }

    fn update_used_item(&mut self, prev_gamestate: &GameState, gamestate: &GameState) {
        let held_entity = match &gamestate.player_held_entity {
            Some(entity) => entity,
            None => return,
        };

        if self.used_low_banned_item(prev_gamestate, gamestate, held_entity) {
            self.fail_low();
            if &held_entity.entity_type == &EntityType::Teleporter {
                self.run_labels.rm_label(&Label::NoTeleporter);
            }
        }
    }

    fn used_low_banned_item(
        &mut self,
        prev_gamestate: &GameState,
        gamestate: &GameState,
        held_entity: &PartialEntity,
    ) -> bool {
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

        // Doesn't have banned item held
        if !banned_low_items.contains(&held_entity.entity_type) {
            return false;
        }

        // Didn't press Whip button.
        if !gamestate.inputs.contains(&Input::Whip) {
            return false;
        }

        // Player is hanging on a ledge. Can't use an item.
        if gamestate.player_ledge_grabbing {
            return false;
        }

        // Ducking. Can't use item.
        if Self::is_ducking(gamestate) || Self::is_ducking(prev_gamestate) {
            return false;
        }

        // If standing on the ground
        if gamestate.player_on_floor && self.frames_since_down < 5 {
            return false;
        }

        return true;
    }

    fn is_ducking(gamestate: &GameState) -> bool {
        if gamestate.player_ducking {
            return true;
        }

        // 25 - Ducking
        // 6 - Ducked
        // 7 - Crawling
        if [25, 6, 7].contains(&gamestate.player_animation_type) {
            return true;
        }

        return false;
    }

    fn update_no_transition(&mut self, gamestate: &GameState) {
        if gamestate.screen_state != ScreenState::LevelCompleted {
            return;
        }

        if let Some(held_item) = &gamestate.player_held_entity {
            if held_item.entity_type == EntityType::Player {
                return;
            }
            self.run_labels.rm_label(&Label::No);
        }
    }

    fn fail_chain_hell(&mut self) {
        if self.chain_hell_failed {
            return;
        }

        self.chain_hell_failed = true;

        self.run_labels.rm_label(&Label::Chain);
        if self.run_labels.has_label(&Label::Eggplant) || self.run_labels.has_label(&Label::Shield)
        {
            self.run_labels.add_label(Label::Bookskip);
        } else {
            self.run_labels.set_terminus(TerminusLabel::Any);
        }

        if self.failed_low_if_not_chain_hell {
            self.fail_low();
        }
    }

    fn fail_max(&mut self) {
        if self.max_failed {
            return;
        }

        self.max_failed = true;
        self.run_labels.rm_label(&Label::Max);
    }

    fn someone_holding(&self, gamestate: &GameState, item: EntityType) -> bool {
        if let Some(held_item) = &gamestate.player_held_entity {
            if held_item.entity_type == item {
                return true;
            }
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
    }

    fn update_starting_resources(&mut self, prev_gamestate: &GameState, gamestate: &GameState) {
        if !self.is_low_percent {
            return;
        }

        if self.is_victory(gamestate) {
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

    fn is_victory(&mut self, gamestate: &GameState) -> bool {
        [
            ScreenState::VictoryWalking,
            ScreenState::VictoryEruption,
            ScreenState::VictoryOutside,
        ]
        .contains(&gamestate.screen_state)
    }

    fn process_victory(&mut self, gamestate: &GameState) {
        if !self.is_victory(gamestate) {
            return;
        }

        if gamestate.level == 16 {
            self.fail_chain_hell();
        }

        self.update_ropes_end_of_run(gamestate);
    }

    fn update_ropes_end_of_run(&mut self, gamestate: &GameState) {
        if gamestate.player_data.ropes < 4 {
            self.run_labels.rm_label(&Label::No);
        }
    }

    fn process_death(&mut self, gamestate: &GameState) {
        self.update_ropes_end_of_run(gamestate);

        if !self.run_labels.has_label(&Label::Pacifist) {
            self.run_labels.set_terminus(TerminusLabel::Death);
        }
    }

    fn update_no_gold(&mut self, gamestate: &GameState) {
        if self.is_victory(gamestate) {
            return;
        }
        if gamestate.total_money > 0 {
            self.run_labels.rm_label(&Label::NoGold);
            self.run_labels.rm_label(&Label::No);
        }
    }

    fn update_pacifist(&mut self, gamestate: &GameState) {
        if (gamestate.player_data.total_kills == 1 && !gamestate.player_data.one_is_olmec)
            || gamestate.player_data.total_kills > 1
        {
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
            category: self
                .run_state
                .run_labels
                .get_text(!self.should_show_modifiers(config), &exclude_labels),
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
            if gamestate.respawn_level == 4 {
                self.run_state = RunState::with_run_labels(RunLabels::new_jungle_shortcut())
            } else if gamestate.respawn_level == 8 {
                self.run_state = RunState::with_run_labels(RunLabels::new_ics())
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
