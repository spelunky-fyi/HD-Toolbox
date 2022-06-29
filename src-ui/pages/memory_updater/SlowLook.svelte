<script type="ts">
  import Button, { Label } from "@smui/button";
  import Card from "@smui/card";
  import { derived } from "svelte/store";

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
</div>

<style>
  .card-container {
    color: rgb(18, 239, 18);
  }

  .card-container.needs-fix {
    color: rgb(255, 73, 73);
  }

  .card-container.connecting {
    color: rgb(255, 192, 55);
  }
</style>
