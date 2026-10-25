<script lang="ts">
  // One item's sprite, or a blank space the same size without one. A hired
  // hand shop ("HH Shop:<count>") is a hired hand from its character sheet.

  import { SPRITES, SHEET_WIDTH, CELL } from "./sprites";
  import { hiredHands } from "./search";

  export let item: string;
  export let size = 40;
  export let highlight = false;
  export let title = item;

  // The hired hand standing, the first cell of a 16 by 16 sheet
  const CHAR_SHEET_WIDTH = 1024;
  const CHAR_CELL = 64;

  $: hiredHand = hiredHands(item) !== null;
  $: sprite = SPRITES[item];
  $: scale = size / CELL;
</script>

{#if hiredHand}
  <span
    class="sprite hired-hand"
    class:highlight
    {title}
    style="width: {size}px; height: {size}px;
      background-size: {(CHAR_SHEET_WIDTH * size) / CHAR_CELL}px auto;
      background-position: 0 0;"
  />
{:else if sprite}
  <span
    class="sprite items"
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
    background-repeat: no-repeat;
  }

  .items {
    background-image: url("/images/tiles/items.png");
  }

  .hired-hand {
    background-image: url("/images/tiles/char_slave.png");
  }

  .highlight {
    border-radius: 4px;
    box-shadow: 0 0 0 2px #73d973;
  }
</style>
