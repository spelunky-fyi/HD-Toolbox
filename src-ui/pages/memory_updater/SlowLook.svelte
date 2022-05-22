<script type="ts">
  import Button, { Label } from "@smui/button";
  import Card, { Content } from "@smui/card";
  import Switch from "@smui/switch/src/Switch.svelte";
  import { derived } from "svelte/store";

  import { autoFixerHeader, enabledAutoFixer } from "@hdt/config";
  import { memoryUpdaterData } from "@hdt/tasks";
  import { invoke } from "@tauri-apps/api/tauri";

  export let connecting = false;

  const needFixText = "Slow Look is active!";
  const noSlowLookText = "Slow Look isn't currently active";

  let needsFix = derived(memoryUpdaterData, ($memoryUpdaterData) => {
    if ($memoryUpdaterData.camera_speed === 0) {
      return false;
    }

    return $memoryUpdaterData.camera_speed !== 0x3f800000;
  });

  let cardText = derived(needsFix, ($needsFix) => {
    if ($needsFix) {
      return needFixText;
    }
    return noSlowLookText;
  });

  function fixSlowLook(_ev) {
    invoke("fix_slowlook")
      .then((value) => console.log(value))
      .catch((reason) => {
        console.error(reason);
      });
  }
</script>

<div class="slow-look">
  <h2>Slow Look</h2>
  {#if !connecting}
    <p class="card-container" class:needs-fix={$needsFix}>
      <Card padded>{$cardText}</Card>
    </p>
  {:else}
    <p class="card-container connecting">
      <Card padded>Connecting...</Card>
    </p>
  {/if}

  <div>
    <Button
      variant="raised"
      disabled={connecting || !$needsFix}
      on:click={fixSlowLook}
      style="justify-content: stretch;"
    >
      <Label>Fix slow look!</Label>
    </Button>
  </div>
  <div>
    <div class="auto-fixer-header">
      <h3>Auto-Fixer</h3>
      <Switch bind:checked={$enabledAutoFixer} />
      <div
        class="switch-state"
        class:disabled={!$enabledAutoFixer}
        class:enabled={$enabledAutoFixer}
      >
        {$autoFixerHeader}
      </div>
    </div>
    <p>
      The Slow Look auto-fixer will ensure your camera speed is always set to
      the correct default between runs.
    </p>
  </div>
</div>

<style>
  .card-container {
    color: rgb(18, 239, 18);
  }

  .card-container.needs-fix {
    color: rgb(255, 73, 73);
  }

  div.auto-fixer-header > h3 {
    border-right: 1px solid white;
    padding-right: 25px;
    margin-right: 10px;
  }
  .auto-fixer-header {
    display: flex;
    align-items: center;
  }
  .switch-state.enabled {
    color: rgb(18, 239, 18);
  }

  .switch-state.disabled {
    color: rgb(255, 73, 73);
  }

  .card-container.connecting {
    color: rgb(255, 192, 55);
  }
</style>
