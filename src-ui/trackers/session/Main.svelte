<script lang="ts">
  import { WebSocketState } from "../websockets";

  import { state, data } from "./stores";

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  function msToTime(s) {
    function pad(n, z) {
      z = z || 2;
      return ("00" + n).slice(-z);
    }

    let ms = s % 1000;
    s = (s - ms) / 1000;
    let secs = s % 60;
    s = (s - secs) / 60;
    let mins = s % 60;
    let hrs = (s - mins) / 60;

    let out = pad(secs, 2) + "." + pad(ms, 3);
    if (mins !== 0 || hrs !== 0) {
      out = pad(mins, 2) + ":" + out;
    }

    if (hrs !== 0) {
      out = pad(hrs, 2) + ":" + out;
    }

    return out;
  }

  function getBiome(areaIdx, levelIdx, level) {
    if (areaIdx == 0) {
      return "mines";
    }
    if (areaIdx == 1) {
      if (levelIdx == 1 && level && level.is_worm) {
        return "worm";
      }
      return "jungle";
    }
    if (areaIdx == 2) {
      if (levelIdx == 1 && level && level.is_worm) {
        return "worm";
      }
      if (levelIdx == 4) {
        return "mothership";
      }
      return "icecaves";
    }
    if (areaIdx == 3) {
      return "temple";
    }
    if (areaIdx == 4) {
      return "hell";
    }
  }

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
      {#if $data.config["enable-session-stats"]}
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
            <span>Score: {formatter.format($data.data.score)}</span>
          {/if}
          {#if $data.config["show-session-time"]}
            <span>Time: {msToTime($data.data.time)}</span>
          {/if}
        </div>
      {/if}

      {#if $data.config["enable-run-stats"]}
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
                          {formatter.format(area.score)}
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
                          {formatter.format(area.score_pace)}
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
                              {formatter.format(
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
    {/if}
  </div>
</main>

<style>
  .wrapper {
    display: table;
    table-layout: fixed;
    width: 100%;
    font-size: 50px;
    font-weight: bold;
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

  .session-container {
    margin-top: 5px;
    height: 200px;
  }

  .session-container span:not(:first-child) {
    border-left: solid 1px grey;
    padding-left: 10px;
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
