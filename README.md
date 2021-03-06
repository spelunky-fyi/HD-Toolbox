# HD-Toolbox

Toolbox full of tools for Spelunky HD

## Potential Functionality

- [ ] Level Viewer (In Progress)
- [x] Game Launcher
- [ ] Overlay + Injector for Science / Practice
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
npm run dev
```

Run Tauri Dev

```console
cargo tauri dev
```

## Release Build

To ship a release you just need to update the version in `src-tauri/Cargo.toml` and push to the `release` branch. This will create a draft with all artifacts.

Once the release has been updated to no longer be a draft you can update the `release.json` with `update-latest-release.py` which controls which version the updater pulls.
