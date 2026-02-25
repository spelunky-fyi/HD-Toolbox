<script type="ts">
  import type { Writable } from "svelte/store";
  import type { Release } from "./external-tool-types";

  export let cachedReleases: Writable<Release[]>;
</script>

{#if $cachedReleases.length > 0}
  <span>{$cachedReleases[0].version}</span>
{:else}
  <span><i>loading...</i></span>
{/if}

<style>
</style>
