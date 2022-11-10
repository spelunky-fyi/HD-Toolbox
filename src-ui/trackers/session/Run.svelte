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
      <div class="run-container">
        {#if $data.config["show-run-area"]}
          <div class="section-container">
            {#each $data.data.run_state.areas as area, areaIdx}
              <div class="area-container">
                <div class="biome-{getBiome(areaIdx, 0, null)}">
                  {#if area !== null}
                    {#if area.completed}
                      {#if $data.config["show-run-speed-stats"]}
                        {msToTime(area.time)}
                      {/if}
                      {#if $data.config["show-run-score-stats"]}
                        {currencyFormatter.format(area.score)}
                      {/if}
                    {/if}
                  {:else}
                    &nbsp;
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        {/if}

        {#if $data.config["show-run-pace"]}
          <div class="section-container">
            {#each $data.data.run_state.areas as area, areaIdx}
              <div class="area-container">
                <div class="biome-{getBiome(areaIdx, 0, null)}">
                  {#if area !== null}
                    {#if area.completed}
                      {#if $data.config["show-run-speed-stats"]}
                        {msToTime(area.time_pace)}
                      {/if}
                      {#if $data.config["show-run-score-stats"]}
                        {currencyFormatter.format(area.score_pace)}
                      {/if}
                    {/if}
                  {:else}
                    &nbsp;
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        {/if}

        {#if $data.config["show-run-il"]}
          <div class="section-container ils">
            {#each $data.data.run_state.areas as area, areaIdx}
              <div class="area-container">
                {#if area !== null}
                  {#each $data.data.run_state.areas[areaIdx].levels as level, levelIdx}
                    <div>
                      {#if level !== null && level.completed}
                        {#if $data.config["show-run-speed-stats"]}
                          <div
                            class="biome-{getBiome(areaIdx, levelIdx, level)}"
                          >
                            {msToTime(
                              $data.data.run_state.areas[areaIdx].levels[
                                levelIdx
                              ].time
                            )}
                          </div>
                        {/if}
                        {#if $data.config["show-run-score-stats"]}
                          <div
                            class="biome-{getBiome(areaIdx, levelIdx, level)}"
                          >
                            {currencyFormatter.format(
                              $data.data.run_state.areas[areaIdx].levels[
                                levelIdx
                              ].score
                            )}
                          </div>
                        {/if}
                      {:else if levelIdx <= 3}
                        &nbsp;
                      {/if}
                    </div>
                  {/each}
                {/if}
              </div>
            {/each}
          </div>
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

  .list-inline {
    list-style: none;
  }
  .section-container {
    margin-left: 0;
    padding-left: 0;
  }

  .run-container {
    margin-top: 5px;
  }

  .ils .area-container:not(:first-child) {
    padding-top: 20px;
  }

  .run-container .section-container:not(:first-child) {
    padding-top: 40px;
  }

  .biome-mines {
    color: rgb(187, 119, 0);
  }
  .biome-jungle {
    color: rgb(0, 211, 39);
  }
  .biome-worm {
    color: rgb(176, 50, 0);
  }
  .biome-icecaves {
    color: rgb(126 112 255);
  }
  .biome-mothership {
    color: rgb(189, 0, 177);
  }
  .biome-temple {
    color: rgb(111, 107, 101);
  }
  .biome-hell {
    color: rgb(107, 0, 0);
  }
</style>
