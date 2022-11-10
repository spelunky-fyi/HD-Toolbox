import { writable } from "svelte/store";

import { Store } from "tauri-plugin-store-api";

export const configLoaded = writable(false);

// Defaults
export const showSessionRuns = writable(true);
export const showSessionDeaths = writable(false);
export const showSessionWins = writable(false);
export const showSessionKills = writable(false);
export const showSessionScore = writable(false);
export const showSessionTime = writable(false);

export const showRunSpeedStats = writable(true);
export const showRunScoreStats = writable(false);
export const showRunIl = writable(true);
export const showRunArea = writable(true);
export const showRunPace = writable(true);

let configMapping = {
  "show-session-runs": showSessionRuns,
  "show-session-deaths": showSessionDeaths,
  "show-session-wins": showSessionWins,
  "show-session-kills": showSessionKills,
  "show-session-score": showSessionScore,
  "show-session-time": showSessionTime,

  "show-run-speed-stats": showRunSpeedStats,
  "show-run-score-stats": showRunScoreStats,
  "show-run-il": showRunIl,
  "show-run-area": showRunArea,
  "show-run-pace": showRunPace,
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
