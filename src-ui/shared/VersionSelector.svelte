<script type="ts">
  import type { Writable } from "svelte/store";
  import type { Release } from "./external-tool-types";

  export let cachedReleases: Writable<Release[]>;
  export let selectedVersion: Writable<string>;
</script>

<div>
  <label class="top-label" for="version">Version</label>
  {#if $cachedReleases.length > 0}
    <select bind:value={$selectedVersion} id="version">
      {#each $cachedReleases as release}
        <option value={release.version}>{release.version}</option>
      {/each}
    </select>
  {:else}
    <select disabled id="version">
      <option>Loading...</option>
    </select>
  {/if}
</div>

<style>
  .top-label {
    font-weight: bold;
    padding-bottom: 2px;
  }
</style>
