import { derived, writable } from "svelte/store";

import { Store } from "tauri-plugin-store-api";
import { cachedReleases } from "./stores";

export const configLoaded = writable(false);

export enum LoadMethod {
  LATEST = 0,
  SPECIFIC_VERSION = 1,
  FILE = 2,
}

// Defaults
export const activeMethod = writable(LoadMethod.LATEST);
export const selectedVersion = writable("");
export const selectedFile = writable("");

let configMapping = {
  "active-method": activeMethod,
  "selected-version": selectedVersion,
  "selected-file": selectedFile,
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

const tauriStore = new Store("specs.config");
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

export function selectMethod(method: LoadMethod) {
  activeMethod.set(method);
}

export const launchable = derived(
  [activeMethod, selectedVersion, selectedFile, cachedReleases],
  ([$activeMethod, $selectedVersion, $selectedFile, $cachedReleases]) => {
    if (
      $activeMethod == LoadMethod.FILE &&
      $selectedFile &&
      $selectedFile.length > 0
    ) {
      return true;
    }

    if (
      $activeMethod == LoadMethod.SPECIFIC_VERSION &&
      $selectedVersion &&
      $cachedReleases &&
      $cachedReleases.length > 0
    ) {
      return true;
    }

    if (
      $activeMethod == LoadMethod.LATEST &&
      $cachedReleases &&
      $cachedReleases.length > 0
    ) {
      return true;
    }

    return false;
  }
);
