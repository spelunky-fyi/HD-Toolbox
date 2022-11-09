import { writable } from "svelte/store";

import { Store } from "tauri-plugin-store-api";

export const configLoaded = writable(false);

// Defaults
export const enableSessionStats = writable(true);
export const enableRunStats = writable(true);

let configMapping = {
  "enable-session-stats": enableSessionStats,
  "enable-run-stats": enableRunStats,
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

const tauriStore = new Store("tracker-session.config");
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
