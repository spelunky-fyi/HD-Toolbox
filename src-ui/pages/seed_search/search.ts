import { writable, get } from "svelte/store";
import { invoke } from "@tauri-apps/api/tauri";
import { listen } from "@tauri-apps/api/event";

// Kept out of the page so a search carries on showing when switching tabs

export interface PresetInfo {
  id: string;
  name: string;
  label: string;
  matchable: boolean;
}

export interface SeedResult {
  seed: number;
  // As in the csv
  values: Record<string, string>;
  // How each value is shown, which can say more than the csv does
  display: Record<string, string>;
}

export interface Progress {
  state: "Starting" | "Running" | "Finished" | "Stopped";
  checked: number;
  total: number;
  seedsPerSecond: number;
  hits: Record<string, number>;
  newResults: SeedResult[];
}

// Value states, as in SeedApp
export const UNKNOWN = -1;
export const NO = 0;
export const YES = 1;
export const NA = 2;

export interface Row {
  seed: number;
  // Per matchable preset
  flags: Record<string, { state: number; levels: string[]; value: string }>;
  // Per list preset (crates and shops)
  lists: Record<string, { state: number; items: string[]; display: string }>;
}

const LEVEL = /^\d+-\d+$/;

function flagState(value: string | undefined) {
  if (!value) return UNKNOWN;
  if (value === "n/a") return NA;
  if (value === "false") return NO;
  return YES;
}

function listState(value: string | undefined) {
  if (!value) return UNKNOWN;
  if (value === "n/a") return NA;
  if (value === "none") return NO;
  return YES;
}

function toRow(result: SeedResult, info: PresetInfo[]): Row {
  const row: Row = { seed: result.seed, flags: {}, lists: {} };
  for (const preset of info) {
    const value = result.values[preset.id];
    if (preset.matchable) {
      row.flags[preset.id] = {
        state: flagState(value),
        levels: (value ?? "").split(";").filter((part) => LEVEL.test(part)),
        value: value ?? "",
      };
    } else {
      const display = result.display[preset.id] ?? value ?? "";
      const state = listState(value);
      row.lists[preset.id] = {
        state,
        // A prize wheel's prize counts as one of its items
        items:
          state === YES
            ? display
                .split(";")
                .map((item) => (item.startsWith("Prize:") ? item.slice(6) : item))
            : [],
        display,
      };
    }
  }
  return row;
}

export const presetInfo = writable<PresetInfo[]>([]);
export const progress = writable<Progress | null>(null);
export const rows = writable<Row[]>([]);
export const failure = writable("");
export const running = writable(false);
// The custom csv the rows came from, "" for the Toolbox's own, null before loading
export const loadedFrom = writable<string | null>(null);

const bySeed = new Map<number, Row>();
let pending: SeedResult[] = [];

function addResults(results: SeedResult[]) {
  const info = get(presetInfo);
  if (info.length === 0) {
    pending.push(...results);
    return;
  }
  for (const result of results) {
    bySeed.set(result.seed, toRow(result, info));
  }
  rows.set([...bySeed.values()].sort((a, b) => a.seed - b.seed));
}

invoke<PresetInfo[]>("seed_search_presets").then((info) => {
  presetInfo.set(info);
  const waiting = pending;
  pending = [];
  addResults(waiting);
});

listen("task-state:SeedSearch", (event) => {
  const update = (<any>event.payload).data;
  if (update.type === "Failure") {
    failure.set(update.data);
    running.set(false);
    return;
  }

  const latest: Progress = update.data;
  progress.set(latest);
  if (latest.newResults.length > 0) {
    addResults(latest.newResults);
  }
  if (latest.state === "Finished" || latest.state === "Stopped") {
    running.set(false);
  }
});

// Shows the seeds already in the results csv, the Toolbox's own for ""
export async function loadResults(path: string) {
  if (get(loadedFrom) === path) {
    return;
  }
  loadedFrom.set(path);
  bySeed.clear();
  rows.set([]);
  try {
    addResults(await invoke<SeedResult[]>("load_seed_search_results", { path }));
  } catch (err) {
    failure.set(String(err));
  }
}

export function startSearch(options: {
  seedCount: number;
  outputCsv: string;
}) {
  failure.set("");
  progress.set(null);
  running.set(true);
  invoke("start_task", { task: { type: "SeedSearch", options } }).catch(
    (err) => {
      failure.set(String(err));
      running.set(false);
    }
  );
}

export function stopSearch() {
  invoke("stop_task", { task: { type: "SeedSearch" } });
}
