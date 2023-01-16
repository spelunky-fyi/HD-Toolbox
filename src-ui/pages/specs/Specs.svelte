<script type="ts">
  import LayoutGrid, { Cell } from "@smui/layout-grid";
  import SvelteMarkdown from "svelte-markdown";

  import { onDestroy, onMount } from "svelte";
  import Latest from "./Latest.svelte";
  import SpecificVersion from "./SpecificVersion.svelte";
  import File from "./File.svelte";
  import { RefreshCwIcon } from "svelte-feather-icons";
  import Button from "@smui/button/src/Button.svelte";

  import releases from "./releases";
  import {
    activeMethod,
    launchable,
    LoadMethod,
    selectedFile,
    selectedVersion,
  } from "./config";
  import { cachedReleases, cachedDocs } from "./stores";
  import docs from "./docs";

  let loadMethods = {
    [LoadMethod.LATEST]: Latest,
    [LoadMethod.SPECIFIC_VERSION]: SpecificVersion,
    [LoadMethod.FILE]: File,
  };

  let timeout;
  let timeoutAmount = 1000 * 60;
  let mounted = false;

  async function run() {
    await releases.cacheReleases();
    await docs.cacheDocs();

    if (mounted) {
      timeout = setTimeout(run, timeoutAmount);
    }
  }

  onMount(async () => {
    mounted = true;
    await run();
    await releases.loadCachedReleases();
    await docs.loadDocs();
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
        <h2>Specs HD</h2>
      </div>
    </Cell>
    <Cell span={4}>
      <div class="header">
        <Button
          color="primary"
          variant="raised"
          style="margin-left: auto;"
          on:click={() =>
            releases.launchSpecs(
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
          <svelte:component this={loadMethods[$activeMethod]} />
        </div>
        {#if $activeMethod != LoadMethod.FILE}
          <div style="display: inline-block;">
            <label class="top-label" for="load-method">&nbsp;</label>
            <Button
              color="primary"
              variant="raised"
              id="refresh-specs"
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
          <i>
            Always use the most recent version of Specs HD. You can hit refresh
            to check if new versions are available.
          </i>
        {:else if $activeMethod == LoadMethod.SPECIFIC_VERSION}
          <i>
            Choose a specific version of Specs HD. You can hit refresh to check
            if new versions are available.
          </i>
        {:else if $activeMethod == LoadMethod.FILE}
          <i>
            Browse to a local dll. This is useful for development or if you
            downloaded a version manually. Not typical for most users.
          </i>
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
            href="https://github.com/spelunky-fyi/SpecsHD/blob/main/DOCS.md"
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
  :global(#refresh-specs) {
    height: 43px;
    margin-top: 5px;
  }
</style>
