<script lang="ts">
  import { WebSocketState } from "../websockets";

  import { state, data } from "./stores";
  import { currencyFormatter, msToTime } from "./utils";

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
    {:else if $data.err !== null}
      <span class="output">{$data.err}</span>
    {:else}
      <div class="session-container">
        {#if $data.config["show-session-runs"]}
          <span>Run #{$data.data.runs}</span>
        {/if}
        {#if $data.config["show-session-deaths"]}
          <span>Deaths: {$data.data.deaths}</span>
        {/if}
        {#if $data.config["show-session-wins"]}
          <span>Wins: {$data.data.wins}</span>
        {/if}
        {#if $data.config["show-session-kills"]}
          <span>Kills: {$data.data.kills}</span>
        {/if}
        {#if $data.config["show-session-score"]}
          <span>Score: {currencyFormatter.format($data.data.score)}</span>
        {/if}
        {#if $data.config["show-session-time"]}
          <span>Time: {msToTime($data.data.time)}</span>
        {/if}
      </div>
    {/if}
  </div>
</main>

<style>
  .wrapper {
    display: table;
    table-layout: fixed;
    width: 100%;
    font-size: 24px;
    font-weight: 900;
    overflow: scroll;
  }

  .output {
    display: table-cell;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .session-container {
    margin-top: 5px;
    height: 200px;
  }

  .session-container span:not(:first-child) {
    border-left: solid 1px grey;
    padding-left: 10px;
  }
</style>
