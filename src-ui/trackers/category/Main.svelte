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
  {#if $state === WebSocketState.Pending}
    <span class="pending">Connecting...</span>
  {:else}
    <span>{$data.category}</span>
  {/if}
</main>

<style>
  main {
    font-size: 70px;
    font-weight: bold;
  }
</style>
