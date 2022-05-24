<script lang="ts">
  import { WebSocketState } from "../websockets";
  import { state, data } from "./stores";
</script>

<main>
  {#if $state === WebSocketState.Pending}
    <span class="pending">Connecting...</span>
  {:else}
    <span>{$data.total_kills}</span>
  {/if}
</main>

<style>
  main {
    font-size: 70px;
    -webkit-text-stroke: 1px black;
    font-weight: bold;
  }
</style>
