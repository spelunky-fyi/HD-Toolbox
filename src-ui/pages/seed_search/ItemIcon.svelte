<script lang="ts">
  // One item's sprite, or a blank space the same size without one

  import { SPRITES, SHEET_WIDTH, CELL } from "./sprites";

  export let item: string;
  export let size = 40;
  export let highlight = false;
  export let title = item;

  $: sprite = SPRITES[item];
  $: scale = size / CELL;
</script>

{#if sprite}
  <span
    class="sprite"
    class:highlight
    {title}
    style="width: {size}px; height: {size}px;
      background-size: {SHEET_WIDTH * scale}px auto;
      background-position: -{sprite[0] * size}px -{sprite[1] * size}px;"
  />
{:else}
  <span class="blank" style="width: {size}px; height: {size}px;" />
{/if}

<style>
  .sprite,
  .blank {
    display: inline-block;
    flex-shrink: 0;
  }

  .sprite {
    background-image: url("/images/tiles/items.png");
    background-repeat: no-repeat;
  }

  .highlight {
    border-radius: 4px;
    box-shadow: 0 0 0 2px #73d973;
  }
</style>
