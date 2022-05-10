<script lang="ts">
  import { onMount } from "svelte";
  import LayoutGrid, { Cell } from "@smui/layout-grid";

  import levels from "@hdt/pages/level_viewer/levels";

  let canvas;
  let bgImg: HTMLImageElement;
  let areaIndex = 0;

  onMount(() => {
    let ctx = canvas.getContext("2d");
    bgImg = new Image();
    bgImg.onload = function () {
      let pattern = ctx.createPattern(bgImg, "repeat");
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
    bgImg.src = "/images/backgrounds/minebg.jpg";
  });
</script>

<LayoutGrid>
  <Cell span={9}>
    <div class="canvas-wrapper">
      <canvas bind:this={canvas} height="640" width="800" />
    </div>
  </Cell>
  <Cell span={3}>
    <select bind:value={areaIndex} width="100%" label="Area">
      {#each levels as level, level_index}
        <option value={level_index}>{level.name}</option>
      {/each}
    </select>

    Area: {areaIndex}

    <select width="100%" label="Room Type">
      {#each levels[areaIndex].data.rooms as rooms, room_index}
        <optgroup label={rooms.name}>
          {#each rooms.rooms as room}
            <option value={room_index}>{room.name}</option>
          {/each}
        </optgroup>
      {/each}
    </select>
  </Cell>
</LayoutGrid>

<style>
  .canvas-wrapper {
    width: 100%;
    height: 100%;
  }
  canvas {
    width: 100%;
    max-height: 640px;
    max-width: 800px;
  }
</style>
