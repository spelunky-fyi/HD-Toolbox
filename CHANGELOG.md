# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## [0.5.3] - 2022-10-08

### Fixed

- Used items weren't properly being tracked when pressing down in the air.

## [0.5.2] - 2022-09-29

### Fixed

- Category Tracker should be more resilient to fast down inputs which should avoid invalidating low% when picking up the sceptre.
- Process connections should be more resilient to Windows case inconsistencies. This should fix the case where Slow Look, Trackers, Specs, etc didn't work for some users.

## [0.5.1] - 2022-06-30

### Changed

- Don't allow manual slowlook fixer or character toggles during runs
- Disable characters toggles when frozen with auto-fixer.

## [0.5.0] - 2022-06-28

### Added

- Support for Locking characters with the auto-fixer
- Persist config changes immediately rather than waiting for shutdown
- Specs docs are now dynamically pulled so they're always up to date

### Fixed

- Specs should no longer crash HD Toolbox when Spelunky isn't running.

## [0.4.0] - 2022-06-23

### Added

- Specs HD is now integrated into HD Toolbox.

## [0.3.5] - 2022-06-18

### Fixed

- Category Tracker
  - No% no longer removed when going through level transition without an item.

### Added

- Trackers
  - Tracker windows can now be resized to a smaller size and text should scale to accomodate that.

## [0.3.4] - 2022-06-17

### Fixed

- Level Viewer
  - Remove mentioned of SIDE from beehive notes as it was incorrect.
  - `r` tilecode now shows half brick / half terrain in area 2
  - `.` tilecode now shows a more obvious marker since "." was mostly invisible
  - Fixed temple `air` chunks which has accidentally been a copy/paste of `temple` chunk
  - Fixed typo in Haunted Castle rooms that said "Caster" instead of "Castle"
  - Use closed door for Mothership, Ice Caves, Wet Fur, and Tutorial Entrance
  - `q` in Hell / Yama now uses hell bricks instead of terrain.

### Added

- Level Viewer
  - Note to Single NPC shop rooms to indicate it can be damsel or HH

## [0.3.3] - 2022-06-16

### Added

- Level Viewer
  - Black Market Rooms/Chunks
  - Haunted Castle Rooms/Chunks
  - Ice Caves Rooms/Chunks
  - Wet Fur Rooms/Chunks
  - Mothership Rooms/Chunks
  - Olmec's Lair Rooms/Chunks
  - Temple/CoG Rooms/Chunks
  - Display Room Type on room views
  - Support Room group notes that apply to all rooms in a grouping
  - Add support for 79 length level to display bugged levels
- Version in tile so people can easily tell which version they're using.

### Fixed

- Level Viewer
  - Fixed Typo in Worm room and Crysknife tilecode. Thanks Spencer!
  - Updated all SIDE rooms in worm to explain SIDE rooms are unused in worm.
  - Typo for double/triple hired hand chances
  - Wood blocks in Tutorial instead of terrain

## [0.3.2] - 2022-06-12

### Fixed

- Level Viewer
  - Updated names in Hell - Entrance - Drop to not be duplicates
  - Fix vine chunks to show 4th row
  - Fix vine preview to show bottom sprite when floor beneath
  - Notes are now properly showing on Round Girl Coffin entries.

### Added

- Level Viewer
  - Rest of Jungle Rooms
  - All Worm Rooms
  - Growable Vine/Chain tile `Q`
  - Support for normal stone brick in `r`
  - Huge number of new tiles supported for Jungle/Worm.

## [0.3.1] - 2022-06-11

### Added

- Level Viewer: All Hell / Yama Rooms and Chunks

### Changed

- Pacifist Tracker:
  - If your only kill is Olmec:
    - and you have kills displayed it'll show "0\*"
    - and you don't have kills displayed it'll show "Pacifist\*"
- Category Tracker
  - If your only kill is Olmec the Pacifist label is no longer removed.
  - If your run is Pacifist when you die it will continue to show the category instead of changing to Death%
