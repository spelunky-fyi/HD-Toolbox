<script lang="ts">
  import { enabledTrackers, trackersHeader } from "@hdt/config";

  import Cell from "@smui/layout-grid/src/Cell.svelte";
  import LayoutGrid from "@smui/layout-grid/src/LayoutGrid.svelte";
  import Switch from "@smui/switch/src/Switch.svelte";
</script>

<div>
  <LayoutGrid>
    <Cell span={12}>
      <div class="header">
        <h2>Trackers</h2>
        <Switch bind:checked={$enabledTrackers} />
        <div
          class="switch-state"
          class:disabled={!$enabledTrackers}
          class:enabled={$enabledTrackers}
        >
          {$trackersHeader}
        </div>
      </div>
    </Cell>
  </LayoutGrid>
</div>

<style>
  h2 {
    border-right: 1px solid white;
    padding-right: 25px;
    margin-right: 10px;
  }
  .header {
    display: flex;
    align-items: center;
  }

  .switch-state.enabled {
    color: rgb(18, 239, 18);
  }

  .switch-state.disabled {
    color: rgb(255, 73, 73);
  }
</style>
