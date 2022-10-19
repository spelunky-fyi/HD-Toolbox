<script type="ts">
  import { cachedReleases } from "./stores";
</script>

{#if $cachedReleases.length > 0}
  <span>{$cachedReleases[0].version}</span>
{:else}
  <span><i>loading...</i></span>
{/if}

<style>
</style>
