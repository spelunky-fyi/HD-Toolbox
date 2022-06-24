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
      <p style="margin-top: 0px;">
        <b>Specs HD</b> is a tool for doing science, practice, and fun in
        Spelunky HD. In order to use Specs HD just click the Launch button above
        after you've started Spelunky HD. We recommend you run
        <code>Latest</code>
        unless you know what you're doing. Once you've launched with
        <b>Specs HD</b> you'll need to restart the game to unload it.
      </p>
      <h4>Keyboard Shortcuts</h4>
      <ul>
        <li>
          <code>Insert</code> - Toggle visibility of the main tool window.
        </li>
      </ul>

      <h4>Mouse Controls</h4>
      <ul>
        <li>
          <code>Right Click</code> - Teleport your spelunker
        </li>
        <li>
          <code>Middle Click</code> - Select Entity
        </li>
      </ul>
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
