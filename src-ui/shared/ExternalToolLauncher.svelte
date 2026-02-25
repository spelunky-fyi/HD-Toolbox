<script type="ts">
  import LayoutGrid, { Cell } from "@smui/layout-grid";
  import SvelteMarkdown from "svelte-markdown";

  import { onDestroy, onMount } from "svelte";
  import LatestVersion from "./LatestVersion.svelte";
  import VersionSelector from "./VersionSelector.svelte";
  import FileSelector from "./FileSelector.svelte";
  import { RefreshCwIcon } from "svelte-feather-icons";
  import Button from "@smui/button/src/Button.svelte";

  import { LoadMethod } from "./external-tool-types";
  import type { ExternalToolInstance } from "./external-tool-types";

  export let tool: ExternalToolInstance;

  const {
    definition,
    activeMethod,
    launchable,
    selectedFile,
    selectedVersion,
    cachedReleases,
    cachedDocs,
    releases,
    docs,
  } = tool;

  let timeout;
  let timeoutAmount = 1000 * 60;
  let mounted = false;

  async function run() {
    try {
      await releases.cacheReleases();
    } catch (err) {
      console.error(`[${definition.title}] cacheReleases failed:`, err);
    }
    try {
      await docs.cacheDocs();
    } catch (err) {
      console.error(`[${definition.title}] cacheDocs failed:`, err);
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
    try {
      await docs.loadDocs();
    } catch (err) {
      console.error(`[${definition.title}] loadDocs failed:`, err);
    }
  });

  onDestroy(() => {
    mounted = false;
    clearTimeout(timeout);
  });
</script>

<div>
  <LayoutGrid>
    <Cell span={8}>
      <div class="header">
        <h2>{definition.title}</h2>
      </div>
    </Cell>
    <Cell span={4}>
      <div class="header">
        <Button
          color="primary"
          variant="raised"
          style="margin-left: auto;"
          on:click={() =>
            releases.launch(
              $cachedReleases,
              $activeMethod,
              $selectedVersion,
              $selectedFile
            )}
          disabled={!$launchable}
        >
          Launch!
        </Button>
      </div>
    </Cell>
    <Cell span={12}>
      <div>
        <div
          style="display: inline-block; padding-right: 5px; margin-top: 5px;"
        >
          <label class="top-label" for="load-method">Load Method</label>

          <select bind:value={$activeMethod} id="load-method">
            <option value={LoadMethod.LATEST}>Latest</option>
            <option value={LoadMethod.SPECIFIC_VERSION}>Specific Version</option
            >
            <option value={LoadMethod.FILE}>File</option>
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
                docs.cacheDocs(true);
              }}
            >
              <RefreshCwIcon />
            </Button>
          </div>
        {/if}
      </div>
    </Cell>
    <Cell span={12}>
      <div style="margin-top: -15px;">
        {#if $activeMethod == LoadMethod.LATEST}
          <i>{definition.helpTexts.latest}</i>
        {:else if $activeMethod == LoadMethod.SPECIFIC_VERSION}
          <i>{definition.helpTexts.specificVersion}</i>
        {:else if $activeMethod == LoadMethod.FILE}
          <i>{definition.helpTexts.file}</i>
        {/if}
      </div>
    </Cell>
  </LayoutGrid>
  <hr />
  <LayoutGrid>
    <Cell span={12}>
      <div style="text-align: right; margin-top: -30px; margin-bottom: 20px;">
        <small>
          The docs below auto-update but you can always check the most up to
          date version
          <a
            href={definition.docsRepoUrl}
            target="_blank"
            rel="noreferrer"
          >
            here
          </a>
        </small>
      </div>
      <SvelteMarkdown source={$cachedDocs} />
    </Cell>
  </LayoutGrid>
</div>

<style>
  .header {
    display: flex;
    align-items: center;
    height: 64px;
  }

  .top-label {
    font-weight: bold;
    padding-bottom: 2px;
  }
  :global(#refresh-tool) {
    height: 43px;
    margin-top: 5px;
  }
</style>
