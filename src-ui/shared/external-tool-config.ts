import { derived, writable, type Writable } from "svelte/store";
import { Store } from "tauri-plugin-store-api";
import { LoadMethod, type Release } from "./external-tool-types";

export function createExternalToolConfig(
  storeName: string,
  cachedReleases: Writable<Release[]>
) {
  const configLoaded = writable(false);
  const activeMethod = writable(LoadMethod.LATEST);
  const selectedVersion = writable("");
  const selectedFile = writable("");

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

  const tauriStore = new Store(storeName);
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

  const launchable = derived(
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

  return {
    configLoaded,
    activeMethod,
    selectedVersion,
    selectedFile,
    launchable,
  };
}
