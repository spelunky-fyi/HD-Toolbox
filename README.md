# HD-Toolbox

Toolbox full of tools for Spelunky HD

## Installation

Grab the latest msi installer [here](https://github.com/spelunky-fyi/HD-Toolbox/releases/latest)


## Potential Functionality

- [x] Level Viewer
- [x] Game Launcher
- [x] Overlay + Injector for Science / Practice (Specs HD)
- [x] Trackers
  - [x] Category
  - [x] Kill Counter
- [ ] Save Management
  - [ ] Editor
  - [ ] Named Backup / Auto Backup / Restore
  - [ ] Stat Viewer
- [ ] Asset Management
  - [ ] WAD/WIX Extractor/Packer
  - [ ] Skin Selector
- [ ] Mod Management
- [ ] External Tool Managment
  - [ ] RTA Tracker
  - [x] Frozlunky
- [x] Memory Shenanigans
  - [x] Character Unlock Manager
  - [x] Slowlook Fix Tool
- [ ] Custom Music Engine

## Development

Run Dev Frontend

```console
# First time install deps
npm install

# Run dev server
npm run dev
```

Run Tauri Dev

```console
cargo tauri dev
```

## Release Build

To ship a release you just need to update the version in `src-tauri/Cargo.toml` and push to the `release` branch. This will create a draft with all artifacts.

Once the release has been updated to no longer be a draft you can update the `release.json` with `update-latest-release.py` which controls which version the updater pulls.
