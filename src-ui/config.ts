import { derived, writable } from "svelte/store";

import { Store } from "tauri-plugin-store-api";

export const configLoaded = writable(false);

// Defaults
export const activeTab = writable("Level Viewer");
export const enabledTrackers = writable(false);
export const enabledAutoFixer = writable(false);
export const enabledMusicEngine = writable(false);
export const trackerPort = writable(4225);

let configMapping = {
  "active-tab": activeTab,
  "enabled-trackers": enabledTrackers,
  "enabled-auto-fixer": enabledAutoFixer,
  "enabled-music-engine": enabledAutoFixer,
  "tracker-port": trackerPort,
};

let subscriptions = {};
function setupSubscribers() {
  for (const [key, store] of Object.entries(configMapping)) {
    subscriptions[key] = store.subscribe((value) => {
      tauriStore.set(key, value);
      tauriStore.save();
    });
  }
}

const tauriStore = new Store("hd-toolbox.config");
tauriStore
  .entries()
  .then((entries) => {
    for (const [key, value] of entries) {
      if (!configMapping[key]) {
        continue;
      }

      configMapping[key].set(<any>value);
    }
    setupSubscribers();
  })
  .finally(() => configLoaded.set(true));

export const autoFixerHeader = derived(enabledAutoFixer, ($config) => {
  if ($config) {
    return "Enabled";
  } else {
    return "Disabled";
  }
});

export const trackersHeader = derived(enabledTrackers, ($config) => {
  if ($config) {
    return "Enabled";
  } else {
    return "Disabled";
  }
});

export const musicEngineHeader = derived(enabledMusicEngine, ($config) => {
  if ($config) {
    return "Enabled";
  } else {
    return "Disabled";
  }
});

export function selectPage(index: string) {
  activeTab.set(index);
}
