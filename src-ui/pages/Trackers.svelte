<script lang="ts">
  import { enabledTrackers, trackerPort, trackersHeader } from "@hdt/config";
  import { TaskState, trackersState } from "@hdt/tasks";
  import Card from "@smui/card/src/Card.svelte";

  import Cell from "@smui/layout-grid/src/Cell.svelte";
  import LayoutGrid from "@smui/layout-grid/src/LayoutGrid.svelte";
  import Switch from "@smui/switch/src/Switch.svelte";
</script>

<div>
  <LayoutGrid>
    <Cell span={8}>
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
    <Cell span={4}>
      <div class="header">
        <input
          id="port"
          style="margin-left: auto; width: 80px;"
          disabled={$enabledTrackers}
          type="number"
          bind:value={$trackerPort}
        />
        <label style="padding-left: 5px; padding-bottom: 10px;" for="port"
          >Port</label
        >
      </div>
    </Cell>
  </LayoutGrid>
  <div>
    {#if $trackersState === TaskState.Pending}
      <p class="card-container">
        <Card padded>
          <div class="connecting-text">
            <span>Enabling Trackers</span>
          </div>
        </Card>
      </p>
    {/if}
  </div>
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
    height: 64px;
  }

  .switch-state.enabled {
    color: rgb(18, 239, 18);
  }

  .switch-state.disabled {
    color: rgb(255, 73, 73);
  }

  .connecting-text {
    display: flex;
    align-items: center;
    color: rgb(255, 192, 55);
  }
  p.card-container {
    margin: 0px;
    position: fixed;
    bottom: 0;
    right: 0;
  }
</style>
