# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

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
