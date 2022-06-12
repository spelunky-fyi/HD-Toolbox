# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Fixed

- Level Viewer
  - Updated names in Hell - Entrance - Drop to not be duplicates
  - Fix vine chunks to show 4th row
  - Fix vine preview to show bottom sprite when floor beneath
  - Notes are now properly showing on Round Girl Coffin entries.

### Added

- Level Viewer: Growable Vine/Chain tile `Q`
- Level Viewer: Support for normal stone brick in `r`

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
