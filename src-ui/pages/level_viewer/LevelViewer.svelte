<script lang="ts">
  import { onMount } from "svelte";
  import LayoutGrid, { Cell } from "@smui/layout-grid";

  let canvas;
  let bgImg: HTMLImageElement;

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
  <Cell span={3}>Controls</Cell>
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
