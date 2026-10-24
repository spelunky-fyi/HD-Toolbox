<script type="ts">
  import { createEventDispatcher, onDestroy, onMount } from "svelte";
  import LatestVersion from "./LatestVersion.svelte";
  import VersionSelector from "./VersionSelector.svelte";
  import FileSelector from "./FileSelector.svelte";
  import { RefreshCwIcon } from "svelte-feather-icons";
  import Button from "@smui/button/src/Button.svelte";
  import { open } from "@tauri-apps/api/dialog";

  import { LoadMethod } from "./external-tool-types";
  import type { ExternalToolInstance } from "./external-tool-types";

  // Where to load a tool from: the latest release, a specific one, or a local
  // file/folder. Keeps the release list up to date while shown.

  export let tool: ExternalToolInstance;
  // One row with no labels, and the help text as a tooltip, for pages where
  // this is one setting among others
  export let compact = false;

  const { definition, activeMethod, selectedFile, selectedVersion, cachedReleases, releases } =
    tool;
  const directory = definition.pathKind == "folder";

  const dispatch = createEventDispatcher();

  $: helpText =
    $activeMethod == LoadMethod.LATEST
      ? definition.helpTexts.latest
      : $activeMethod == LoadMethod.SPECIFIC_VERSION
      ? definition.helpTexts.specificVersion
      : definition.helpTexts.file;

  function refresh() {
    releases.cacheReleases(true);
    dispatch("refresh");
  }

  async function choosePath() {
    const path = await open({
      multiple: false,
      directory,
      filters: directory
        ? []
        : [{ name: definition.fileFilterLabel, extensions: definition.fileFilterExtensions }],
    });
    if (path) {
      selectedFile.set(path as string);
    }
  }

  let timeout: ReturnType<typeof setTimeout>;
  let timeoutAmount = 1000 * 60;
  let mounted = false;

  async function run() {
    try {
      await releases.cacheReleases();
    } catch (err) {
      console.error(`[${definition.title}] cacheReleases failed:`, err);
    }

    if (mounted) {
      timeout = setTimeout(run, timeoutAmount);
    }
  }

  onMount(async () => {
    mounted = true;
    await run();
    try {
      await releases.loadCachedReleases();
    } catch (err) {
      console.error(`[${definition.title}] loadCachedReleases failed:`, err);
    }
  });

  onDestroy(() => {
    mounted = false;
    clearTimeout(timeout);
  });
</script>

{#if compact}
  <div class="compact" title={helpText}>
    <select bind:value={$activeMethod}>
      <option value={LoadMethod.LATEST}>Latest</option>
      <option value={LoadMethod.SPECIFIC_VERSION}>Specific Version</option>
      <option value={LoadMethod.FILE}>{directory ? "Folder" : "File"}</option>
    </select>
    {#if $activeMethod === LoadMethod.FILE}
      <span class="path" class:dim={!$selectedFile} title={$selectedFile}>
        {$selectedFile || `No ${directory ? "folder" : "file"} selected`}
      </span>
      <Button on:click={choosePath}>{definition.chooseFileLabel}</Button>
    {:else}
      {#if $activeMethod === LoadMethod.SPECIFIC_VERSION && $cachedReleases.length > 0}
        <select bind:value={$selectedVersion}>
          {#each $cachedReleases as release}
            <option value={release.version}>{release.version}</option>
          {/each}
        </select>
      {:else if $cachedReleases.length > 0}
        <span>{$cachedReleases[0].version}</span>
      {:else}
        <span class="dim">Loading...</span>
      {/if}
      <button class="icon-button" title="Check for new versions" on:click={refresh}>
        <RefreshCwIcon size="16" />
      </button>
    {/if}
  </div>
{:else}
<div>
  <div style="display: inline-block; padding-right: 5px; margin-top: 5px;">
    <label class="top-label" for="load-method">Load Method</label>

    <select bind:value={$activeMethod} id="load-method">
      <option value={LoadMethod.LATEST}>Latest</option>
      <option value={LoadMethod.SPECIFIC_VERSION}>Specific Version</option>
      <option value={LoadMethod.FILE}>{directory ? "Folder" : "File"}</option>
    </select>
  </div>
  <div style="display: inline-block; padding-right: 5px;">
    {#if $activeMethod === LoadMethod.LATEST}
      <LatestVersion {cachedReleases} />
    {:else if $activeMethod === LoadMethod.SPECIFIC_VERSION}
      <VersionSelector {cachedReleases} {selectedVersion} />
    {:else if $activeMethod === LoadMethod.FILE}
      <FileSelector
        {selectedFile}
        {directory}
        filterName={definition.fileFilterLabel}
        filterExtensions={definition.fileFilterExtensions}
        chooseLabel={definition.chooseFileLabel}
      />
    {/if}
  </div>
  {#if $activeMethod != LoadMethod.FILE}
    <div style="display: inline-block;">
      <label class="top-label" for="load-method">&nbsp;</label>
      <Button
        color="primary"
        variant="raised"
        id="refresh-tool"
        on:click={() => {
          releases.cacheReleases(true);
          dispatch("refresh");
        }}
      >
        <RefreshCwIcon />
      </Button>
    </div>
  {/if}
</div>
<div class="help">
  {#if $activeMethod == LoadMethod.LATEST}
    <i>{definition.helpTexts.latest}</i>
  {:else if $activeMethod == LoadMethod.SPECIFIC_VERSION}
    <i>{definition.helpTexts.specificVersion}</i>
  {:else if $activeMethod == LoadMethod.FILE}
    <i>{definition.helpTexts.file}</i>
  {/if}
</div>
{/if}

<style>
  .compact {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
  }
  .compact select {
    margin: 0;
    padding: 4px 6px;
  }
  .compact .path {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .dim {
    opacity: 0.65;
  }
  .icon-button {
    display: inline-flex;
    margin: 0;
    padding: 6px;
    color: inherit;
    background: transparent;
    border: none;
    border-radius: 50%;
    cursor: pointer;
  }
  .icon-button:hover,
  .icon-button:not(:disabled):active {
    background: rgba(128, 128, 128, 0.2);
  }
  .top-label {
    font-weight: bold;
    padding-bottom: 2px;
  }
  .help {
    margin-top: 9px;
  }
  :global(#refresh-tool) {
    height: 43px;
    margin-top: 5px;
  }
</style>
