<script type="ts">
  import { selectedVersion } from "./config";

  import { cachedReleases } from "./stores";
</script>

<div>
  <label class="top-label" for="version">Version</label>
  {#if $cachedReleases.length > 0}
    <select bind:value={$selectedVersion} id="version" label="Version">
      {#each $cachedReleases as release}
        <option value={release.version}>{release.version}</option>
      {/each}
    </select>
  {:else}
    <select disabled id="version" label="Version">
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
