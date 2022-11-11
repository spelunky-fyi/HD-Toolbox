<script lang="ts">
  import { WebSocketState } from "../websockets";

  import { state, data } from "./stores";
  import { currencyFormatter, getBiome, msToTime } from "./utils";

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
      <table class="run-container">
        {#if $data.config["show-run-area"]}
          {#each $data.data.run_state.areas as area, areaIdx}
            <tr class="area-container">
              {#if area !== null}
                {#if area.completed}
                  {#if $data.config["show-run-speed-stats"]}
                    <td class="biome-{getBiome(areaIdx, 0, null)}"
                      >{msToTime(area.time, $data.config["show-run-ms"])}</td
                    >
                  {/if}
                  {#if $data.config["show-run-score-stats"]}
                    <td class="biome-{getBiome(areaIdx, 0, null)}"
                      >{currencyFormatter.format(area.score)}</td
                    >
                  {/if}
                {:else}
                  <td>&nbsp;</td>
                {/if}
              {:else}
                <td>&nbsp;</td>
              {/if}
            </tr>
          {/each}
          <tr>
            <td>&nbsp;</td>
          </tr>
        {/if}

        {#if $data.config["show-run-pace"]}
          {#each $data.data.run_state.areas as area, areaIdx}
            <tr class="area-container">
              {#if area !== null}
                {#if area.completed}
                  {#if $data.config["show-run-speed-stats"]}
                    <td class="biome-{getBiome(areaIdx, 0, null)}"
                      >{msToTime(
                        area.time_pace,
                        $data.config["show-run-ms"]
                      )}</td
                    >
                  {/if}
                  {#if $data.config["show-run-score-stats"]}
                    <td class="biome-{getBiome(areaIdx, 0, null)}"
                      >{currencyFormatter.format(area.score_pace)}</td
                    >
                  {/if}
                {:else}
                  <td>&nbsp;</td>
                {/if}
              {:else}
                <td>&nbsp;</td>
              {/if}
            </tr>
          {/each}
          <tr>
            <td>&nbsp;</td>
          </tr>
        {/if}

        {#if $data.config["show-run-il"]}
          {#each $data.data.run_state.areas as area, areaIdx}
            {#if areaIdx > 0}
              <tr><td class="padding" /></tr>
            {/if}
            {#if area !== null}
              {#each $data.data.run_state.areas[areaIdx].levels as level, levelIdx}
                <tr class="level-container">
                  {#if level !== null && level.completed}
                    {#if $data.config["show-run-speed-stats"]}
                      <td class="biome-{getBiome(areaIdx, levelIdx, level)}">
                        {msToTime(
                          $data.data.run_state.areas[areaIdx].levels[levelIdx]
                            .time,
                          $data.config["show-run-ms"]
                        )}
                      </td>
                    {/if}
                    {#if $data.config["show-run-score-stats"]}
                      <td class="biome-{getBiome(areaIdx, levelIdx, level)}">
                        {currencyFormatter.format(
                          $data.data.run_state.areas[areaIdx].levels[levelIdx]
                            .score
                        )}
                      </td>
                    {/if}
                  {:else if levelIdx <= 3}
                    <td>&nbsp;</td>
                  {/if}
                </tr>
              {/each}
            {/if}
          {/each}
        {/if}
      </table>
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

  td {
    padding-right: 20px;
  }

  td.padding {
    padding-top: 10px;
  }

  .output {
    display: table-cell;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .run-container {
    margin-top: 5px;
  }

  .biome-mines {
    /* color: rgb(187, 119, 0); */
    -webkit-text-stroke: 2px rgb(132, 84, 0);
  }
  .biome-jungle {
    /* color: rgb(0, 211, 39); */
    -webkit-text-stroke: 2px rgb(0, 111, 20);
  }
  .biome-worm {
    /* color: rgb(176, 50, 0); */
    -webkit-text-stroke: 2px rgb(212, 104, 32);
  }
  .biome-icecaves {
    /* color: rgb(126 112 255); */
    -webkit-text-stroke: 2px rgb(19, 0, 186);
  }
  .biome-mothership {
    /* color: rgb(189, 0, 177); */
    -webkit-text-stroke: 2px rgb(105, 0, 98);
  }
  .biome-temple {
    /* color: rgb(111, 107, 101); */
    -webkit-text-stroke: 2px rgb(97, 97, 97);
  }
  .biome-hell {
    /* color: rgb(107, 0, 0); */
    -webkit-text-stroke: 2px rgb(84, 0, 0);
  }
</style>
