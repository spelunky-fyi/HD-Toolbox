<script lang="ts">
  import { WebSocketState } from "../websockets";

  import { state, data } from "./stores";

  document.addEventListener(
    "contextmenu",
    (e) => {
      e.preventDefault();
      return false;
    },
    { capture: true }
  );
</script>

<main class="text-stroke">
  <div class="wrapper">
    {#if $state === WebSocketState.Pending}
      <span class="output pending">Connecting...</span>
    {:else}
      <span class="output">{$data}</span>
    {/if}
  </div>
</main>

<style>
  .wrapper {
    display: table;
    table-layout: fixed;
    width: 100%;
    font-size: 4vw;
    font-weight: bold;
  }

  .output {
    display: table-cell;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>
