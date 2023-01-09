<script type="ts">
  import LayoutGrid, { Cell } from "@smui/layout-grid";
  import Switch from "@smui/switch/src/Switch.svelte";
  import Button from "@smui/button/src/Button.svelte";
  import Card from "@smui/card/src/Card.svelte";

  import { enabledMusicEngine, musicEngineHeader } from "@hdt/config";
  import { defaultPlaylist } from "./config";
  import { musicEngineState, TaskState } from "@hdt/tasks";

  const connectingText = "Looking for running Spelunky.exe...";
</script>

<div>
  {#if $musicEngineState == TaskState.Pending}
    <p class="card-container">
      <Card padded>
        <div class="connecting-text">
          <span>{connectingText}</span>
        </div>
      </Card>
    </p>
  {/if}
</div>

<div>
  <LayoutGrid>
    <Cell span={8}>
      <div class="header">
        <h2>Music Engine</h2>
        <Switch bind:checked={$enabledMusicEngine} />
        <div
          class="switch-state"
          class:disabled={!$enabledMusicEngine}
          class:enabled={$enabledMusicEngine}
        >
          {$musicEngineHeader}
        </div>
      </div>
    </Cell>
    <Cell span={4} />
  </LayoutGrid>
</div>

<style>
  .header {
    display: flex;
    align-items: center;
    height: 64px;
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

  .switch-state.enabled {
    color: rgb(18, 239, 18);
  }

  .switch-state.disabled {
    color: rgb(255, 73, 73);
  }
</style>
