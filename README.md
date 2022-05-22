# HD-Toolbox

Toolbox full of tools for Spelunky HD

## Potential Functionality

- [-] Level Viewer
- [x] Game Launcher
- [ ] Overlay + Injector for Science / Practice
- [ ] Trackers
  - [ ] Category
  - [ ] Kill Counter
- [ ] Save Management
  - [ ] Editor
  - [ ] Named Backup / Auto Backup / Restore
  - [ ] Stat Viewer
- [ ] WAD/WIX Extractor/Packer
  - [ ] Skin Selector
- [ ] Mod Management
- [ ] External Tool Managment
  - [ ] RTA Tracker
  - [ ] Frozlunky
- [x] Memory Shenanigans
  - [x] Character Unlock Manager
  - [x] Slowlook Fix Tool

## Development

Run Dev Frontend

```console
# First time install deps
npm install

# Run dev server
npm dev
```

Run Tauri Dev

```console
cargo tauri dev
```

## Release Build

To ship a release you just need to update the version in `src-tauri/Cargo.toml` and push to the `release` branch. This will create a draft with all artifacts.

Once the release has been updated to no longer be a draft you can update the `release.json` with `update-latest-release.py` which controls which version the updater pulls.
