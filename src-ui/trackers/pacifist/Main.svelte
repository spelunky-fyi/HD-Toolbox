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
      <span class="pending">Connecting...</span>
    {:else if $data.show_kills}
      {#if $data.total_kills === 1 && $data.one_is_olmec}
        <span class="output">0*</span>
      {:else}
        <span class="output">{$data.total_kills}</span>
      {/if}
    {:else if $data.total_kills === 1 && $data.one_is_olmec}
      <span class="output pacifist">Pacifist*</span>
    {:else if $data.total_kills > 0}
      <span class="output murderer">MURDERER!</span>
    {:else}
      <span class="output pacifist">Pacifist</span>
    {/if}
  </div>
</main>

<style>
  .wrapper {
    display: table;
    table-layout: fixed;
    width: 100%;
    font-size: 14vw;
    font-weight: bold;
  }

  .output {
    display: table-cell;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>
