<script type="ts">
  import { onMount, onDestroy } from "svelte";
  import { derived } from "svelte/store";
  import Switch from "@smui/switch";

  import { images } from "@hdt/images";
  import { memoryUpdaterData } from "@hdt/tasks";

  export let x;
  export let y;
  export let charIdx: number;
  export let connecting = true;

  const width = 128;
  const height = 36;

  let canvas;

  onMount(() => {
    draw();
  });

  function draw() {
    let ctx = canvas.getContext("2d");
    ctx.drawImage(
      images["leaderpics"],
      x,
      y,
      width,
      height,
      0,
      0,
      width,
      height
    );
  }

  let unlocked = derived(memoryUpdaterData, ($memoryUpdaterData) => {
    return $memoryUpdaterData.chars[charIdx] == 1;
  });

  function handleClick(ev) {
    memoryUpdaterData.update((values) => {
      let newValues = { ...values };
      newValues.chars[charIdx] = +!$unlocked;
      return newValues;
    });
  }
</script>

<diV>
  <canvas
    class:connecting
    class:locked={!$unlocked}
    disabled={connecting}
    bind:this={canvas}
    on:click={handleClick}
    {width}
    {height}
  />
  <Switch
    disabled={connecting}
    checked={$unlocked}
    on:SMUISwitch:change={handleClick}
  />
</diV>

<style>
  canvas {
    padding: 5px;
  }

  canvas:hover {
    cursor: pointer;
  }

  canvas.connecting {
    cursor: default;
    filter: grayscale(100%) blur(1px) sepia(100%);
  }

  canvas.locked {
    filter: grayscale(100%) blur(1px) sepia(100%);
  }
</style>
