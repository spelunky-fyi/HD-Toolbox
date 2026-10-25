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
    itemLabel,
    UNKNOWN,
    NO,
    YES,
    NA,
  } from "./search";
  import type { PresetInfo, Row, ShopKind } from "./search";

  // Only this many matches are drawn, the csv has every seed
  const MAX_SHOWN = 500;

  const FLAG_CHOICES: [string, number | null][] = [
    ["Any", null],
    ["Yes", YES],
    ["No", NO],
    ["N/A", NA],
  ];

  // n/a in the csv is no shop. A shop always has something for sale, so there
  // isn't a choice for one with nothing.
  const SHOP_CHOICES: [string, number | null][] = [
    ["Any", null],
    ["Yes", YES],
    ["No Shop", NA],
  ];

  // 1-3's shop can also be a hired hand or prize wheel (roulette) shop
  const SHOP_KIND_CHOICES: [string, ShopKind | null][] = [
    ["Any", null],
    ["Normal", "normal"],
    ["HH Shop", "hh"],
    ["Roulette Shop", "roulette"],
  ];
  const SHOP_KIND_PRESETS = ["Shop13"];

  $: if ($configLoaded) loadResults($outputCsv);

  $: flagPresets = $presetInfo.filter((info) => info.kind === "flag");
  $: listPresets = $presetInfo.filter((info) => info.kind === "list");
  $: countPresets = $presetInfo.filter((info) => info.kind === "count");
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
  // At least this much of a count preset
  let countMin: Record<string, number> = {};
  let shopKindFilter: Record<string, ShopKind | null> = {};
  // Seeds with these digits somewhere in them
  let seedFilter = "";
  $: seedDigits = seedFilter.replace(/\D/g, "");

  function resetFilters() {
    seedFilter = "";
    flagFilter = {};
    flagLevels = {};
    groupItems = {};
    groupMatchAll = {};
    groupPresence = {};
    groupMinCount = {};
    countMin = {};
    shopKindFilter = {};
  }

  // Counts over every seed, like SeedApp. One pass over the rows, since there
  // can be hundreds of thousands of them.
  function add<T>(counts: Map<T, number>, key: T) {
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  function byPreset<T>(presets: PresetInfo[], make: () => T): Record<string, T> {
    return Object.fromEntries(presets.map((info) => [info.id, make()]));
  }

  function countRows(
    all: Row[],
    flags: PresetInfo[],
    lists: PresetInfo[],
    numbers: PresetInfo[],
  ) {
    const flagCounts = byPreset(flags, () => new Map<number, number>());
    const levels = byPreset(flags, () => new Map<string, number>());
    const items = byPreset(lists, () => new Map<string, number>());
    const presenceCounts = byPreset(lists, () => new Map<number, number>());
    const shopKindCounts = byPreset(lists, () => new Map<ShopKind, number>());
    const maxItems = byPreset(lists, () => 0);
    const maxCounts = byPreset(numbers, () => 0);

    for (const row of all) {
      for (const info of numbers) {
        const count = row.counts[info.id];
        if (count != null) maxCounts[info.id] = Math.max(maxCounts[info.id], count);
      }
      for (const info of flags) {
        const flag = row.flags[info.id];
        add(flagCounts[info.id], flag?.state ?? UNKNOWN);
        for (const level of flag?.levels ?? []) add(levels[info.id], level);
      }
      for (const info of lists) {
        const list = row.lists[info.id];
        add(presenceCounts[info.id], list?.state ?? UNKNOWN);
        if (list?.shopKind) add(shopKindCounts[info.id], list.shopKind);
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
      shopKindCounts,
      maxItems,
      maxCounts,
    };
  }

  $: ({
    flagCounts,
    levelCounts,
    itemCounts,
    presenceCounts,
    shopKindCounts,
    maxItems,
    maxCounts,
  } = countRows($rows, flagPresets, listPresets, countPresets));

  // Seeds with at least the chosen amount, for showing next to the filter
  $: countMatches = Object.fromEntries(
    countPresets.map((info) => {
      const min = countMin[info.id] ?? 0;
      let n = 0;
      for (const row of $rows) {
        const count = row.counts[info.id];
        if (count != null && count >= min) n++;
      }
      return [info.id, n];
    }),
  );

  function passes(row: Row) {
    if (seedDigits && !String(row.seed).includes(seedDigits)) return false;
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
      const kind = shopKindFilter[info.id];
      if (kind != null && list.shopKind !== kind) return false;
      if (list.items.length < (groupMinCount[info.id] ?? 0)) return false;
      const chosen = groupItems[info.id] ?? [];
      if (chosen.length > 0) {
        const matchAll = groupMatchAll[info.id] ?? true;
        const has = (item: string) => list.items.includes(item);
        if (matchAll ? !chosen.every(has) : !chosen.some(has)) return false;
      }
    }
    for (const info of countPresets) {
      const min = countMin[info.id] ?? 0;
      if (min <= 0) continue;
      const count = row.counts[info.id];
      if (count == null || count < min) return false;
    }
    return true;
  }

  // Takes the filters so it reruns when any of them change
  function filterRows(all: Row[], ..._filters: unknown[]) {
    return all.filter(passes);
  }

  $: matching = filterRows(
    $rows,
    seedDigits,
    flagFilter,
    flagLevels,
    groupItems,
    groupMatchAll,
    groupPresence,
    groupMinCount,
    countMin,
    shopKindFilter,
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
  // Presets whose absence is worth showing too, as "No <label>"
  const SHOW_NO = ["Lavafalls"];

  function hasList(row: Row) {
    return flagPresets.flatMap((info) => {
      const flag = row.flags[info.id];
      if (flag.state === NO && SHOW_NO.includes(info.id)) {
        return [{ id: info.id, text: `No ${info.label}`, on: flagFilter[info.id] === NO }];
      }
      if (flag.state !== YES) return [];
      return [
        {
          id: info.id,
          text: flag.levels.length
            ? `${info.label} ${flag.levels.join(", ")}`
            : info.label,
          on: flagFilter[info.id] === YES,
        },
      ];
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

  // 0 searches until stopped
  $: canStart =
    !$running &&
    $launchable &&
    Number.isInteger(Number($seedCount)) &&
    Number($seedCount) >= 0;

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

  // Scouting a seed
  let scoutSeed = "";
  $: scoutValue = /^\d+$/.test(scoutSeed.trim())
    ? Number(scoutSeed.trim())
    : null;
  $: canScout =
    !$running &&
    $launchable &&
    scoutValue !== null &&
    scoutValue <= 0xffffffff;
  // The seed being scouted, picked once its results are in
  let scouting: number | null = null;

  $: if (scouting !== null && !$running) {
    const seed = scouting;
    scouting = null;
    picked = $rows.find((row) => row.seed === seed) ?? null;
  }

  function scout() {
    if (scoutValue === null) return;
    // Show just this seed
    resetFilters();
    seedFilter = String(scoutValue);
    scouting = scoutValue;
    start(scoutValue);
  }

  function start(seed?: number) {
    startSearch(
      {
        seedCount: Number($seedCount),
        outputCsv: $outputCsv,
        seed,
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

        <span class="label">Results CSV Path</span>
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

        <label class="label" for="seed-count">
          Scout # Seeds
          <span class="hint">Set to zero to search indefinitely</span>
        </label>
        <div class="setting">
          <input
            id="seed-count"
            type="number"
            min="0"
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
              on:click={() => start()}
            >
              Search!
            </Button>
          {/if}
          {#if $progress}
            <span class="progress">
              <b>{$progress.state}</b>
              {$progress.checked.toLocaleString()}
              {#if $progress.total > 0}
                / {$progress.total.toLocaleString()}
              {:else}
                <span class="dim">(until stopped)</span>
              {/if}
              {#if $progress.state !== "Finished" && $progress.state !== "Stopped" && $progress.checked < $progress.rescouting}
                <span class="dim"
                  >- filling in older seeds first, {$progress.checked.toLocaleString()}
                  / {$progress.rescouting.toLocaleString()}</span
                >
              {/if}
              {#if $progress.seedsPerSecond > 0}
                <span class="dim"
                  >({$progress.seedsPerSecond.toFixed(1)} seeds/sec)</span
                >
              {/if}
            </span>
          {/if}
        </div>

        <label class="label" for="scout-seed">Scout specific seed</label>
        <form class="setting" on:submit|preventDefault={scout}>
          <input
            id="scout-seed"
            type="text"
            inputmode="numeric"
            placeholder="A seed"
            disabled={$running}
            bind:value={scoutSeed}
          />
          <Button type="submit" variant="outlined" disabled={!canScout}
            >Scout</Button
          >
          <span class="dim">Generates just this seed and shows it</span>
        </form>
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
          <h4>Seed</h4>
          <input
            class="seed-filter"
            type="text"
            inputmode="numeric"
            placeholder="Has these digits, e.g. 45654"
            bind:value={seedFilter}
          />
        </section>

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

        {#each countPresets as info}
          <section>
            <h4>{info.label}</h4>
            <div class="choices">
              <span class="dim">At least</span>
              <input
                type="range"
                min="0"
                max={maxCounts[info.id] ?? 0}
                value={countMin[info.id] ?? 0}
                on:input={(event) =>
                  (countMin[info.id] = Number(event.currentTarget.value))}
              />
              <span>{countMin[info.id] ?? 0}</span>
              <span class="dim">({countMatches[info.id] ?? 0})</span>
            </div>
          </section>
        {/each}

        {#each listPresets as info}
          <section>
            <h4>
              {info.label}
              <span class="dim small"
                >({(groupItems[info.id] ?? []).length} on)</span
              >
            </h4>
            {#if SHOP_KIND_PRESETS.includes(info.id)}
              <div class="choices">
                <span class="dim">Shop:</span>
                {#each SHOP_KIND_CHOICES as [label, kind]}
                  <label>
                    <input
                      type="radio"
                      name="shop-kind-{info.id}"
                      checked={(shopKindFilter[info.id] ?? null) === kind}
                      on:change={() => (shopKindFilter[info.id] = kind)}
                    />
                    {label}
                    {#if kind !== null}
                      <span class="dim"
                        >({shopKindCounts[info.id]?.get(kind) ?? 0})</span
                      >
                    {/if}
                  </label>
                {/each}
              </div>
            {:else if isShop(info)}
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
                  <span>{itemLabel(item)}</span>
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
              {#each countPresets as info}
                <tr>
                  <td class="dim">{info.label}</td>
                  <td>{picked.counts[info.id] ?? "-"}</td>
                </tr>
              {/each}
              <tr>
                <td class="dim">Has</td>
                <td>
                  {#each hasList(picked) as has (has.id)}
                    <span class="chip" class:on={has.on}
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
                {#each countPresets as info}
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
                  {#each countPresets as info}
                    <td class="count">{row.counts[info.id] ?? "-"}</td>
                  {/each}
                  <td class="has">
                    {#each hasList(row) as has (has.id)}
                      <span class="chip" class:on={has.on}
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

  .hint {
    display: block;
    font-size: 0.75em;
    font-weight: normal;
    opacity: 0.6;
  }

  .path {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  #seed-count,
  #scout-seed {
    width: 110px;
    margin: 0;
    padding: 6px 8px;
  }

  .seed-filter {
    width: 100%;
    box-sizing: border-box;
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
    padding: 4px 0;
  }

  .flag + .flag {
    border-top: 1px solid rgba(128, 128, 128, 0.2);
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

  /* Column dividers. The sticky header's is a shadow, since a collapsed
     border doesn't stay with a sticky cell. */
  .table td + td {
    border-left: 1px solid rgba(128, 128, 128, 0.2);
  }

  .table th + th {
    box-shadow: inset 1px 0 0 rgba(128, 128, 128, 0.2);
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

  .table td.count {
    text-align: right;
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
