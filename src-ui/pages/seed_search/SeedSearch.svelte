<script lang="ts">
  import { save } from "@tauri-apps/api/dialog";
  import { writeText } from "@tauri-apps/api/clipboard";
  import { invoke } from "@tauri-apps/api/tauri";
  import Button from "@smui/button/src/Button.svelte";
  import ExternalToolSource from "@hdt/shared/ExternalToolSource.svelte";

  import ItemList from "./ItemList.svelte";
  import ItemIcon from "./ItemIcon.svelte";
  import { configLoaded, seedCount, outputCsv } from "./config";
  import { seedSearchTool } from "./tool";
  import {
    presetInfo,
    progress,
    rows,
    failure,
    running,
    loadResults,
    startSearch,
    stopSearch,
    UNKNOWN,
    NO,
    YES,
    NA,
  } from "./search";
  import type { PresetInfo, Row } from "./search";

  // Only this many matches are drawn, the csv has every seed
  const MAX_SHOWN = 500;

  const FLAG_CHOICES: [string, number | null][] = [
    ["Any", null],
    ["Yes", YES],
    ["No", NO],
    ["N/A", NA],
  ];

  // "none" in the csv is a shop with nothing for sale, n/a is no shop
  const SHOP_CHOICES: [string, number | null][] = [
    ["Any", null],
    ["Yes", YES],
    ["No Shop", NA],
    ["Empty", NO],
  ];

  $: if ($configLoaded) loadResults($outputCsv);

  $: flagPresets = $presetInfo.filter((info) => info.matchable);
  $: listPresets = $presetInfo.filter((info) => !info.matchable);
  function isShop(info: PresetInfo) {
    return info.id !== "Crates11";
  }

  // Filters

  let flagFilter: Record<string, number | null> = {};
  let flagLevels: Record<string, string[]> = {};
  let groupItems: Record<string, string[]> = {};
  let groupMatchAll: Record<string, boolean> = {};
  let groupPresence: Record<string, number | null> = {};
  let groupMinCount: Record<string, number> = {};

  function resetFilters() {
    flagFilter = {};
    flagLevels = {};
    groupItems = {};
    groupMatchAll = {};
    groupPresence = {};
    groupMinCount = {};
  }

  // Counts over every seed, like SeedApp. One pass over the rows, since there
  // can be hundreds of thousands of them.
  function add<T>(counts: Map<T, number>, key: T) {
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  function byPreset<T>(presets: PresetInfo[], make: () => T): Record<string, T> {
    return Object.fromEntries(presets.map((info) => [info.id, make()]));
  }

  function countRows(all: Row[], flags: PresetInfo[], lists: PresetInfo[]) {
    const flagCounts = byPreset(flags, () => new Map<number, number>());
    const levels = byPreset(flags, () => new Map<string, number>());
    const items = byPreset(lists, () => new Map<string, number>());
    const presenceCounts = byPreset(lists, () => new Map<number, number>());
    const maxItems = byPreset(lists, () => 0);

    for (const row of all) {
      for (const info of flags) {
        const flag = row.flags[info.id];
        add(flagCounts[info.id], flag?.state ?? UNKNOWN);
        for (const level of flag?.levels ?? []) add(levels[info.id], level);
      }
      for (const info of lists) {
        const list = row.lists[info.id];
        add(presenceCounts[info.id], list?.state ?? UNKNOWN);
        const listItems = list?.items ?? [];
        for (const item of new Set(listItems)) add(items[info.id], item);
        maxItems[info.id] = Math.max(maxItems[info.id], listItems.length);
      }
    }

    const sorted = (counts: Record<string, Map<string, number>>) =>
      Object.fromEntries(
        Object.entries(counts).map(([id, map]) => [
          id,
          [...map].sort(([a], [b]) => a.localeCompare(b)),
        ]),
      );
    return {
      flagCounts,
      levelCounts: sorted(levels),
      itemCounts: sorted(items),
      presenceCounts,
      maxItems,
    };
  }

  $: ({ flagCounts, levelCounts, itemCounts, presenceCounts, maxItems } =
    countRows($rows, flagPresets, listPresets));

  function passes(row: Row) {
    for (const info of flagPresets) {
      const flag = row.flags[info.id];
      const want = flagFilter[info.id];
      if (want != null && flag.state !== want) return false;
      const levels = flagLevels[info.id] ?? [];
      if (
        levels.length > 0 &&
        !flag.levels.some((level) => levels.includes(level))
      )
        return false;
    }
    for (const info of listPresets) {
      const list = row.lists[info.id];
      const presence = groupPresence[info.id];
      if (presence != null && list.state !== presence) return false;
      if (list.items.length < (groupMinCount[info.id] ?? 0)) return false;
      const chosen = groupItems[info.id] ?? [];
      if (chosen.length > 0) {
        const matchAll = groupMatchAll[info.id] ?? true;
        const has = (item: string) => list.items.includes(item);
        if (matchAll ? !chosen.every(has) : !chosen.some(has)) return false;
      }
    }
    return true;
  }

  // Takes the filters so it reruns when any of them change
  function filterRows(all: Row[], ..._filters: unknown[]) {
    return all.filter(passes);
  }

  $: matching = filterRows(
    $rows,
    flagFilter,
    flagLevels,
    groupItems,
    groupMatchAll,
    groupPresence,
    groupMinCount,
  );

  // Picking a seed

  let picked: Row | null = null;
  $: if (picked && !matching.includes(picked)) picked = null;

  function pickRandom() {
    picked = matching[Math.floor(Math.random() * matching.length)] ?? null;
  }

  function choose(row: Row) {
    picked = row;
    writeText(String(row.seed));
  }

  // Display

  // The seed properties a seed has, with the levels they're on
  function hasList(row: Row) {
    return flagPresets
      .filter((info) => row.flags[info.id].state === YES)
      .map((info) => {
        const levels = row.flags[info.id].levels;
        return {
          id: info.id,
          text: levels.length
            ? `${info.label} ${levels.join(", ")}`
            : info.label,
        };
      });
  }

  function naLabel(info: PresetInfo) {
    return isShop(info) ? "No Shop" : "N/A";
  }

  // Settings

  const {
    launchable,
    cachedReleases,
    activeMethod,
    selectedVersion,
    selectedFile,
  } = seedSearchTool;

  $: canStart = !$running && $launchable && $seedCount > 0;

  // Where results go without a custom file, shown on hover
  let defaultCsv = "";
  invoke<string>("default_seed_search_csv").then((path) => (defaultCsv = path));

  async function chooseOutputCsv() {
    const file = await save({
      defaultPath: $outputCsv || defaultCsv,
      filters: [{ name: "Seed Search Results", extensions: ["csv"] }],
    });
    if (file) outputCsv.set(file);
  }

  function start() {
    startSearch(
      {
        seedCount: Number($seedCount),
        outputCsv: $outputCsv,
      },
      // Downloads hd-seed-search first if this version isn't already
      () =>
        seedSearchTool.releases.resolvePath(
          $cachedReleases,
          $activeMethod,
          $selectedVersion,
          $selectedFile,
        ),
    );
  }
</script>

{#if $configLoaded}
  <div class="page">
    <div class="top">
      <div class="title">
        <h2>Seed Search</h2>
        <span class="dim">
          Generates levels with the game's level generation, with a copy of
          Spelunky HD. Seeded the same as Specs' seeded mode.
        </span>
      </div>
      <div class="settings">
        <span class="label">Generator</span>
        <ExternalToolSource tool={seedSearchTool} compact />

        <span class="label">Results</span>
        <div class="setting">
          {#if $outputCsv}
            <span class="path" title={$outputCsv}>{$outputCsv}</span>
            <Button disabled={$running} on:click={chooseOutputCsv}
              >Change</Button
            >
            <Button disabled={$running} on:click={() => outputCsv.set("")}
              >Use Default</Button
            >
          {:else}
            <span class="path dim" title={defaultCsv}
              >Default ({defaultCsv})</span
            >
            <Button disabled={$running} on:click={chooseOutputCsv}
              >Use Custom File...</Button
            >
          {/if}
        </div>

        <label class="label" for="seed-count">Seeds</label>
        <div class="setting">
          <input
            id="seed-count"
            type="number"
            min="1"
            step="1000"
            disabled={$running}
            bind:value={$seedCount}
          />
          {#if $running}
            <Button color="secondary" variant="raised" on:click={stopSearch}
              >Stop</Button
            >
          {:else}
            <Button
              color="primary"
              variant="raised"
              disabled={!canStart}
              on:click={start}
            >
              Search!
            </Button>
          {/if}
          {#if $progress}
            <span class="progress">
              <b>{$progress.state}</b>
              {$progress.checked.toLocaleString()} / {$progress.total.toLocaleString()}
              {#if $progress.seedsPerSecond > 0}
                <span class="dim"
                  >({$progress.seedsPerSecond.toFixed(1)} seeds/sec)</span
                >
              {/if}
            </span>
          {/if}
        </div>
      </div>
      {#if $failure}
        <pre class="failure">{$failure}</pre>
      {/if}
    </div>

    <div class="body">
      <div class="filters">
        <div class="filters-header">
          <h3>Filters</h3>
          <Button on:click={resetFilters}>Reset Filters</Button>
        </div>

        <section>
          <h4>Seed Properties</h4>
          {#each flagPresets as info}
            <div class="flag">
              <div class="flag-name">
                {info.label}
              </div>
              <div class="choices">
                {#each FLAG_CHOICES as [label, state]}
                  {#if state !== NA || flagCounts[info.id]?.get(NA)}
                    <label>
                      <input
                        type="radio"
                        name="flag-{info.id}"
                        checked={(flagFilter[info.id] ?? null) === state}
                        on:change={() => {
                          flagFilter[info.id] = state;
                          if (state === NO || state === NA)
                            flagLevels[info.id] = [];
                        }}
                      />
                      {label}
                      {#if state !== null}
                        <span class="dim"
                          >({flagCounts[info.id]?.get(state) ?? 0})</span
                        >
                      {/if}
                    </label>
                  {/if}
                {/each}
              </div>
              {#if levelCounts[info.id]?.length}
                <div class="choices levels">
                  <span class="dim">On level:</span>
                  {#each levelCounts[info.id] as [level, count]}
                    <label>
                      <input
                        type="checkbox"
                        checked={(flagLevels[info.id] ?? []).includes(level)}
                        on:change={(event) => {
                          const levels = flagLevels[info.id] ?? [];
                          flagLevels[info.id] = event.currentTarget.checked
                            ? [...levels, level]
                            : levels.filter((other) => other !== level);
                          if (
                            event.currentTarget.checked &&
                            flagFilter[info.id] !== YES
                          )
                            flagFilter[info.id] = null;
                        }}
                      />
                      {level} <span class="dim">({count})</span>
                    </label>
                  {/each}
                </div>
              {/if}
            </div>
          {/each}
        </section>

        {#each listPresets as info}
          <section>
            <h4>
              {info.label}
              <span class="dim small"
                >({(groupItems[info.id] ?? []).length} on)</span
              >
            </h4>
            {#if isShop(info)}
              <div class="choices">
                <span class="dim">Shop:</span>
                {#each SHOP_CHOICES as [label, state]}
                  {#if state === null || presenceCounts[info.id]?.get(state)}
                    <label>
                      <input
                        type="radio"
                        name="shop-{info.id}"
                        checked={(groupPresence[info.id] ?? null) === state}
                        on:change={() => (groupPresence[info.id] = state)}
                      />
                      {label}
                      {#if state !== null}
                        <span class="dim"
                          >({presenceCounts[info.id]?.get(state) ?? 0})</span
                        >
                      {/if}
                    </label>
                  {/if}
                {/each}
              </div>
            {:else if maxItems[info.id] > 0}
              <div class="choices">
                <span class="dim">At least</span>
                <input
                  type="range"
                  min="0"
                  max={maxItems[info.id]}
                  value={groupMinCount[info.id] ?? 0}
                  on:input={(event) =>
                    (groupMinCount[info.id] = Number(
                      event.currentTarget.value,
                    ))}
                />
                <span>{groupMinCount[info.id] ?? 0} items</span>
              </div>
            {/if}
            <div class="choices">
              <label>
                <input
                  type="radio"
                  name="all-{info.id}"
                  checked={groupMatchAll[info.id] ?? true}
                  on:change={() => (groupMatchAll[info.id] = true)}
                />
                Has all
              </label>
              <label>
                <input
                  type="radio"
                  name="all-{info.id}"
                  checked={!(groupMatchAll[info.id] ?? true)}
                  on:change={() => (groupMatchAll[info.id] = false)}
                />
                Has any
              </label>
              <button
                class="small-button"
                on:click={() => (groupItems[info.id] = [])}
              >
                Clear
              </button>
            </div>
            <div class="items">
              {#each itemCounts[info.id] ?? [] as [item, count]}
                <label class="item">
                  <input
                    type="checkbox"
                    checked={(groupItems[info.id] ?? []).includes(item)}
                    on:change={(event) => {
                      const items = groupItems[info.id] ?? [];
                      groupItems[info.id] = event.currentTarget.checked
                        ? [...items, item]
                        : items.filter((other) => other !== item);
                    }}
                  />
                  <ItemIcon {item} size={28} />
                  <span>{item}</span>
                  <span class="dim">({count})</span>
                </label>
              {/each}
            </div>
          </section>
        {/each}
      </div>

      <div class="results">
        <div class="results-header">
          <span>
            <b>{matching.length.toLocaleString()}</b> of {$rows.length.toLocaleString()}
            seeds match
          </span>
          <Button
            variant="raised"
            disabled={matching.length === 0}
            on:click={pickRandom}
          >
            Pick Random
          </Button>
        </div>

        {#if picked}
          <div class="picked">
            <div class="picked-seed">
              <span class="big">{picked.seed}</span>
              <Button on:click={() => writeText(String(picked.seed))}
                >Copy</Button
              >
              <Button on:click={pickRandom}>Reroll</Button>
            </div>
            <table class="picked-details">
              {#each listPresets as info}
                <tr>
                  <td class="dim">{info.label}</td>
                  <td>
                    <ItemList
                      value={picked.lists[info.id].state === UNKNOWN
                        ? "n/a"
                        : picked.lists[info.id].state === YES
                          ? picked.lists[info.id].display
                          : picked.lists[info.id].state === NA
                            ? "n/a"
                            : "none"}
                      naLabel={naLabel(info)}
                      highlight={groupItems[info.id] ?? []}
                    />
                  </td>
                </tr>
              {/each}
              <tr>
                <td class="dim">Has</td>
                <td>
                  {#each hasList(picked) as has (has.id)}
                    <span class="chip" class:on={flagFilter[has.id] === YES}
                      >{has.text}</span
                    >
                  {:else}
                    <span class="dim">-</span>
                  {/each}
                </td>
              </tr>
            </table>
          </div>
        {/if}

        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>Seed</th>
                {#each listPresets as info}
                  <th>{info.label}</th>
                {/each}
                <th class="has">Has</th>
              </tr>
            </thead>
            <tbody>
              {#each matching.slice(0, MAX_SHOWN) as row (row.seed)}
                <tr
                  class:selected={row === picked}
                  on:click={() => choose(row)}
                  title="Click to select and copy the seed"
                >
                  <td class="seed">{row.seed}</td>
                  {#each listPresets as info}
                    <td>
                      <ItemList
                        value={row.lists[info.id].state === YES
                          ? row.lists[info.id].display
                          : row.lists[info.id].state === NO
                            ? "none"
                            : "n/a"}
                        naLabel={row.lists[info.id].state === UNKNOWN
                          ? "-"
                          : naLabel(info)}
                        highlight={groupItems[info.id] ?? []}
                        size={32}
                      />
                    </td>
                  {/each}
                  <td class="has">
                    {#each hasList(row) as has (has.id)}
                      <span class="chip" class:on={flagFilter[has.id] === YES}
                        >{has.text}</span
                      >
                    {/each}
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
          {#if matching.length > MAX_SHOWN}
            <p class="dim">
              Showing the first {MAX_SHOWN} of {matching.length.toLocaleString()}
              matching seeds. Narrow the filters or pick one at random.
            </p>
          {/if}
        </div>
      </div>
    </div>
  </div>
{:else}
  <div>Loading...</div>
{/if}

<style>
  .page {
    display: flex;
    flex-direction: column;
    height: 100%;
    box-sizing: border-box;
    padding: 12px 16px 0;
  }

  .top h2 {
    margin: 0;
    white-space: nowrap;
  }

  .title {
    display: flex;
    align-items: baseline;
    gap: 16px;
    margin-bottom: 12px;
  }

  .settings {
    display: grid;
    grid-template-columns: max-content minmax(0, 1fr);
    align-items: center;
    gap: 8px 16px;
  }

  .setting {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    min-height: 36px;
  }

  .label {
    font-weight: bold;
  }

  .path {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  #seed-count {
    width: 110px;
    margin: 0;
    padding: 6px 8px;
  }

  .progress {
    margin-left: 8px;
    white-space: nowrap;
  }

  .failure {
    color: #e57373;
    white-space: pre-wrap;
  }

  .body {
    display: flex;
    flex: 1;
    min-height: 0;
    gap: 16px;
    margin-top: 12px;
    border-top: 1px solid rgba(128, 128, 128, 0.3);
  }

  .filters {
    width: 340px;
    flex-shrink: 0;
    overflow-y: auto;
    padding: 8px 8px 16px 0;
    border-right: 1px solid rgba(128, 128, 128, 0.3);
  }

  .filters-header,
  .results-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .filters h3 {
    margin: 0;
  }

  section {
    margin-top: 12px;
  }

  h4 {
    margin: 0 0 6px;
    padding-bottom: 2px;
    border-bottom: 1px solid rgba(128, 128, 128, 0.3);
  }

  .flag {
    margin-bottom: 8px;
  }

  .choices {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px 10px;
    margin: 2px 0;
  }

  .levels {
    padding-left: 16px;
  }

  .items {
    display: flex;
    flex-direction: column;
  }

  .item {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .small-button {
    font: inherit;
    font-size: smaller;
    padding: 0 6px;
    cursor: pointer;
  }

  .results {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
    padding-top: 8px;
  }

  .results-header {
    margin-bottom: 8px;
  }

  .table-wrap {
    flex: 1;
    min-height: 0;
    overflow: auto;
    padding-bottom: 16px;
  }

  .picked {
    margin: 8px 0 12px;
    padding: 8px 12px;
    border: 1px solid rgba(128, 128, 128, 0.4);
    border-radius: 6px;
  }

  .picked-seed {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .big {
    font-size: 1.8em;
    font-weight: bold;
  }

  .picked-details td {
    padding: 2px 12px 2px 0;
  }

  .table {
    border-collapse: collapse;
    width: 100%;
  }

  .table th {
    position: sticky;
    top: 0;
    z-index: 1;
    background: var(--mdc-theme-background, #222);
    text-align: left;
    padding: 4px 8px;
    white-space: nowrap;
  }

  .table td {
    padding: 2px 8px;
    border-bottom: 1px solid rgba(128, 128, 128, 0.25);
    white-space: nowrap;
  }

  .table tbody tr {
    cursor: pointer;
  }

  .table tbody tr:hover,
  .table tbody tr.selected {
    background: rgba(128, 128, 128, 0.15);
  }

  .seed {
    font-variant-numeric: tabular-nums;
  }

  .table td.has {
    width: 100%;
    min-width: 160px;
    white-space: normal;
  }

  .chip {
    display: inline-block;
    margin: 2px 4px 2px 0;
    padding: 1px 8px;
    border-radius: 10px;
    font-size: smaller;
    white-space: nowrap;
    background: rgba(128, 128, 128, 0.2);
  }

  .chip.on {
    color: #73d973;
    box-shadow: inset 0 0 0 1px #73d973;
  }

  .dim {
    opacity: 0.65;
  }

  .small {
    font-size: smaller;
  }
</style>
