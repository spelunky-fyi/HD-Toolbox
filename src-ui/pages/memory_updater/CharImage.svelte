<script type="ts">
  import { onMount, onDestroy } from "svelte";
  import Switch from "@smui/switch";

  import { images, imagesLoaded } from "@hdt/stores";

  export let x;
  export let y;
  export let connecting = true;

  const width = 128;
  const height = 36;

  let canvas;
  let unsubscribeImagesLoaded;
  let unlocked = true;

  onMount(() => {
    unsubscribeImagesLoaded = imagesLoaded.subscribe((value) => {
      if (!value) {
        return;
      }
      draw();
    });
  });
  onDestroy(() => unsubscribeImagesLoaded && unsubscribeImagesLoaded());

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

  function handleClick(event) {
    if (connecting) {
      return;
    }

    unlocked = !unlocked;
  }
</script>

<diV>
  <canvas
    class:connecting
    class:locked={!unlocked}
    disabled={connecting}
    bind:this={canvas}
    {width}
    {height}
    on:click={handleClick}
  />
  <Switch disabled={connecting} bind:checked={unlocked} />
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
