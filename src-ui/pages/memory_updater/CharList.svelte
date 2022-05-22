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
        <CharImage {connecting} charIdx={0} x={0 + 128 * 0} y={6 + 48 * 1} />
        <CharImage {connecting} charIdx={1} x={0 + 128 * 1} y={6 + 48 * 1} />
        <CharImage {connecting} charIdx={2} x={0 + 128 * 2} y={6 + 48 * 1} />
        <CharImage {connecting} charIdx={3} x={0 + 128 * 3} y={6 + 48 * 1} />

        <CharImage {connecting} charIdx={4} x={0 + 128 * 0} y={6 + 48 * 2} />
        <CharImage {connecting} charIdx={5} x={0 + 128 * 1} y={6 + 48 * 2} />
        <CharImage {connecting} charIdx={6} x={0 + 128 * 2} y={6 + 48 * 2} />
        <CharImage {connecting} charIdx={7} x={0 + 128 * 3} y={6 + 48 * 2} />
      </Cell>
      <Cell span={6}>
        <CharImage {connecting} charIdx={8} x={0 + 128 * 0} y={6 + 48 * 3} />
        <CharImage {connecting} charIdx={9} x={0 + 128 * 1} y={6 + 48 * 3} />
        <CharImage {connecting} charIdx={10} x={0 + 128 * 2} y={6 + 48 * 3} />
        <CharImage {connecting} charIdx={11} x={0 + 128 * 3} y={6 + 48 * 3} />

        <CharImage {connecting} charIdx={12} x={0 + 128 * 0} y={6 + 48 * 4} />
        <CharImage {connecting} charIdx={13} x={0 + 128 * 1} y={6 + 48 * 4} />
        <CharImage {connecting} charIdx={14} x={0 + 128 * 2} y={6 + 48 * 4} />
        <CharImage {connecting} charIdx={15} x={0 + 128 * 3} y={6 + 48 * 4} />
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
