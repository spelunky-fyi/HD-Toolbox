import { writable, get } from "svelte/store";
import { invoke } from "@tauri-apps/api/tauri";
import { listen } from "@tauri-apps/api/event";

// Kept out of the page so a search carries on showing when switching tabs

export interface PresetInfo {
  id: string;
  name: string;
  label: string;
  matchable: boolean;
  // "flag" is yes or no (with levels), "list" the items somewhere, "count" a
  // number
  kind: "flag" | "list" | "count";
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
  // How many of the first seeds are ones already in the csv missing values
  rescouting: number;
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
  lists: Record<
    string,
    { state: number; items: string[]; display: string; shopKind: ShopKind | null }
  >;
  // Per count preset, null when the seed doesn't have one yet
  counts: Record<string, number | null>;
}

const LEVEL = /^\d+-\d+$/;
const HH_SHOP = /^HH Shop:(\d+)$/;

// What sort of shop a shop preset's value is: a hired hand shop, a prize
// wheel (roulette) shop, or a normal one with items for sale
export type ShopKind = "normal" | "hh" | "roulette";

function shopKind(value: string | undefined, display: string): ShopKind | null {
  if (!value || value === "n/a" || value === "none") return null;
  const entries = display.split(";");
  if (entries.some((entry) => HH_SHOP.test(entry))) return "hh";
  if (entries.some((entry) => entry === "Prize Wheel" || entry.startsWith("Prize:")))
    return "roulette";
  return "normal";
}

// The hired hands in a hired hand shop's "HH Shop:<count>", or null for
// anything else
export function hiredHands(item: string): number | null {
  const hhShop = HH_SHOP.exec(item);
  return hhShop ? Number(hhShop[1]) : null;
}

// How an item in a list value reads
export function itemLabel(item: string) {
  const count = hiredHands(item);
  if (count !== null) {
    return `HH Shop (${count} hired hand${count === 1 ? "" : "s"})`;
  }
  return item;
}

function flagState(value: string | undefined) {
  if (!value) return UNKNOWN;
  if (value === "n/a") return NA;
  // A list of levels is "none" without any, like lavafalls
  if (value === "false" || value === "none") return NO;
  return YES;
}

// The shop presets. A shop always has something for sale, so "none" is no
// shop, which is how SpecsHD's 1-2 column has it.
const SHOP_PRESETS = ["Shop12", "Shop13"];

function listState(value: string | undefined, shop: boolean) {
  if (!value) return UNKNOWN;
  if (value === "n/a") return NA;
  if (value === "none") return shop ? NA : NO;
  return YES;
}

function toRow(result: SeedResult, info: PresetInfo[]): Row {
  const row: Row = { seed: result.seed, flags: {}, lists: {}, counts: {} };
  for (const preset of info) {
    const value = result.values[preset.id];
    if (preset.kind === "count") {
      const count = Number(value);
      row.counts[preset.id] = value && Number.isFinite(count) ? count : null;
    } else if (preset.kind === "flag") {
      row.flags[preset.id] = {
        state: flagState(value),
        levels: (value ?? "").split(";").filter((part) => LEVEL.test(part)),
        value: value ?? "",
      };
    } else {
      const display = result.display[preset.id] ?? value ?? "";
      const state = listState(value, SHOP_PRESETS.includes(preset.id));
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
        shopKind: shopKind(value, display),
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
// bySeed's rows sorted by seed, as last published to rows
let sorted: Row[] = [];
// Rows not in sorted yet, and whether a seed already in it was replaced
let added: Row[] = [];
let replaced = false;
let pending: SeedResult[] = [];

// Publishing reruns the page's counts and filters over every row, so a busy
// search only does it this often
const PUBLISH_MS = 1000;
let publishTimer: ReturnType<typeof setTimeout> | null = null;

function publish() {
  publishTimer = null;
  if (replaced) {
    sorted = [...bySeed.values()].sort((a, b) => a.seed - b.seed);
  } else {
    added.sort((a, b) => a.seed - b.seed);
    const merged: Row[] = new Array(sorted.length + added.length);
    let i = 0;
    let j = 0;
    for (let k = 0; k < merged.length; k++) {
      merged[k] =
        j >= added.length || (i < sorted.length && sorted[i].seed < added[j].seed)
          ? sorted[i++]
          : added[j++];
    }
    sorted = merged;
  }
  added = [];
  replaced = false;
  rows.set(sorted);
}

function addResults(results: SeedResult[], now = false) {
  const info = get(presetInfo);
  if (info.length === 0) {
    pending.push(...results);
    return;
  }
  for (const result of results) {
    const row = toRow(result, info);
    if (bySeed.has(result.seed)) {
      replaced = true;
    } else {
      added.push(row);
    }
    bySeed.set(result.seed, row);
  }
  if (now) {
    if (publishTimer) clearTimeout(publishTimer);
    publish();
  } else if (!publishTimer) {
    publishTimer = setTimeout(publish, PUBLISH_MS);
  }
}

function clearResults() {
  if (publishTimer) clearTimeout(publishTimer);
  publishTimer = null;
  bySeed.clear();
  sorted = [];
  added = [];
  replaced = false;
  rows.set([]);
}

invoke<PresetInfo[]>("seed_search_presets").then((info) => {
  presetInfo.set(info);
  const waiting = pending;
  pending = [];
  addResults(waiting, true);
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
  const done = latest.state === "Finished" || latest.state === "Stopped";
  // When it's done, everything is shown before running goes false
  if (latest.newResults.length > 0 || done) {
    addResults(latest.newResults, done);
  }
  if (done) {
    running.set(false);
  }
});

// Shows the seeds already in the results csv, the Toolbox's own for ""
export async function loadResults(path: string) {
  if (get(loadedFrom) === path) {
    return;
  }
  loadedFrom.set(path);
  clearResults();
  try {
    addResults(await invoke<SeedResult[]>("load_seed_search_results", { path }), true);
  } catch (err) {
    failure.set(String(err));
  }
}

// toolDir finds the folder with hd-seed-search, which can mean downloading it
export async function startSearch(
  options: {
    seedCount: number;
    outputCsv: string;
    // Just this seed, to scout it
    seed?: number;
  },
  toolDir: () => Promise<string>
) {
  failure.set("");
  progress.set(null);
  running.set(true);
  try {
    const task = { type: "SeedSearch", options: { ...options, toolDir: await toolDir() } };
    await invoke("start_task", { task });
  } catch (err) {
    failure.set(String(err));
    running.set(false);
  }
}

export function stopSearch() {
  invoke("stop_task", { task: { type: "SeedSearch" } });
}
