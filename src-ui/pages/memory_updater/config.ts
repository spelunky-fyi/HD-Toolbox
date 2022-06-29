import { derived, writable } from "svelte/store";

import { Store } from "tauri-plugin-store-api";

export const configLoaded = writable(false);

// Defaults
export const autoFixSlowLook = writable(true);
export const autoFixCharacters = writable(false);
export const desiredCharacters = writable([]);

let configMapping = {
  "auto-fix-slow-look": autoFixSlowLook,
  "auto-fix-characters": autoFixCharacters,
  "desired-characters": desiredCharacters,
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

const tauriStore = new Store("auto-fixer.config");
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
