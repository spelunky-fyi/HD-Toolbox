<script type="ts">
  import LayoutGrid, { Cell } from "@smui/layout-grid";

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
  import { cachedReleases } from "./stores";

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

    if (mounted) {
      timeout = setTimeout(run, timeoutAmount);
    }
  }

  onMount(async () => {
    mounted = true;
    await run();
    await releases.loadCachedReleases();
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

          <select
            bind:value={$activeMethod}
            id="load-method"
            label="Load Method"
          >
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
              on:click={() => releases.cacheReleases(true)}
            >
              <RefreshCwIcon />
            </Button>
          </div>
        {/if}
      </div>
    </Cell>
  </LayoutGrid>
  <hr />
  <LayoutGrid>
    <Cell span={12}>
      <i>TODO: Instructions Here. :X</i>
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
