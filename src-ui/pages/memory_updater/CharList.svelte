<script type="ts">
  import LayoutGrid, { Cell } from "@smui/layout-grid";

  import CharImage from "./CharImage.svelte";

  export let connecting = false;
</script>

<div class="char-list">
  <h2>Character Unlocker</h2>
  <div class="grid">
    <LayoutGrid class="grid" style="padding-top: 0px;">
      <Cell span={6}>
        <CharImage {connecting} x={0 + 128 * 0} y={6 + 48 * 1} />
        <CharImage {connecting} x={0 + 128 * 1} y={6 + 48 * 1} />
        <CharImage {connecting} x={0 + 128 * 2} y={6 + 48 * 1} />
        <CharImage {connecting} x={0 + 128 * 3} y={6 + 48 * 1} />

        <CharImage {connecting} x={0 + 128 * 0} y={6 + 48 * 2} />
        <CharImage {connecting} x={0 + 128 * 1} y={6 + 48 * 2} />
        <CharImage {connecting} x={0 + 128 * 2} y={6 + 48 * 2} />
        <CharImage {connecting} x={0 + 128 * 3} y={6 + 48 * 2} />
      </Cell>
      <Cell span={6}>
        <CharImage {connecting} x={0 + 128 * 0} y={6 + 48 * 3} />
        <CharImage {connecting} x={0 + 128 * 1} y={6 + 48 * 3} />
        <CharImage {connecting} x={0 + 128 * 2} y={6 + 48 * 3} />
        <CharImage {connecting} x={0 + 128 * 3} y={6 + 48 * 3} />

        <CharImage {connecting} x={0 + 128 * 0} y={6 + 48 * 4} />
        <CharImage {connecting} x={0 + 128 * 1} y={6 + 48 * 4} />
        <CharImage {connecting} x={0 + 128 * 2} y={6 + 48 * 4} />
        <CharImage {connecting} x={0 + 128 * 3} y={6 + 48 * 4} />
      </Cell>
    </LayoutGrid>
  </div>
</div>

<style>
  .char-list {
    padding-left: 10px;
  }
  .grid {
    border-right: 1px solid white;
  }
</style>
