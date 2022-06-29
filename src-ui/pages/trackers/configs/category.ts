import { writable } from "svelte/store";

import { Store } from "tauri-plugin-store-api";

export const configLoaded = writable(false);

// Defaults
export const hideEarly = writable(false);
export const showNo = writable(false);
export const showNoGold = writable(true);
export const showPacifist = writable(true);
export const altNames = writable(false);

let configMapping = {
  "hide-early": hideEarly,
  "show-no": showNo,
  "show-no-gold": showNoGold,
  "show-pacifist": showPacifist,
  "alt-names": altNames,
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

const tauriStore = new Store("tracker-category.config");
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
