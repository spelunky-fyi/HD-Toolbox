<script lang="ts">
  import { showKills } from "@hdt/pages/trackers/configs/pacifist";
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
  {:else if $data.show_kills}
    <span>{$data.total_kills}</span>
  {:else if $data.total_kills > 0}
    <span>MURDERER!</span>
  {:else}
    <span>Pacifist</span>
  {/if}
</main>

<style>
  main {
    font-size: 70px;
    font-weight: bold;
  }
</style>
