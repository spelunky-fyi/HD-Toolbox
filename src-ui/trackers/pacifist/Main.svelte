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
  <div class="wrapper">
    {#if $state === WebSocketState.Pending}
      <span class="pending">Connecting...</span>
    {:else if $data.show_kills}
      <span class="output">{$data.total_kills}</span>
    {:else if $data.total_kills > 0}
      <span class="output murderer">MURDERER!</span>
    {:else}
      <span class="output pacifist">Pacifist</span>
    {/if}
  </div>
</main>

<style>
  main {
    font-size: 70px;
    font-weight: bold;
  }

  .wrapper {
    display: table;
    table-layout: fixed;
    width: 100%;
  }

  .output {
    display: table-cell;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>
