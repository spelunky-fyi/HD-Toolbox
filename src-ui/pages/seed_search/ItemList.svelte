<script lang="ts">
  // Shows a seed search list value ("Bomb Bag;Shotgun") as item sprites,
  // falling back to the name for anything without one. "Prize:<item>" is a
  // prize wheel and its prize.

  import ItemIcon from "./ItemIcon.svelte";
  import { SPRITES } from "./sprites";

  export let value: string;
  export let size = 40;
  // What n/a means for this column
  export let naLabel = "N/A";
  // Items to pick out, like the ones being filtered for
  export let highlight: string[] = [];

  $: items = value === "none" || value === "n/a" ? [] : value.split(";");
</script>

{#if items.length === 0}
  <span class="empty">{value === "none" ? "None" : naLabel}</span>
{:else}
  <span class="items">
    {#each items as entry}
      {@const prize = entry.startsWith("Prize:")}
      {@const item = prize ? entry.slice("Prize:".length) : entry}
      {#if prize}
        <span class="name">Prize Wheel:</span>
      {/if}
      {#if SPRITES[item]}
        <ItemIcon
          {item}
          {size}
          highlight={highlight.includes(item)}
          title={prize ? `Prize Wheel: ${item}` : item}
        />
      {:else}
        <span class="name" class:highlight={highlight.includes(item)}>{item}</span>
      {/if}
    {/each}
  </span>
{/if}

<style>
  .items {
    display: inline-flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: 2px;
  }

  .name {
    font-size: smaller;
  }

  .highlight {
    border-radius: 4px;
    box-shadow: 0 0 0 2px #73d973;
  }

  .empty {
    opacity: 0.6;
  }
</style>
