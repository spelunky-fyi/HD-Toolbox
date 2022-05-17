<script type="ts">
  import { images } from "@hdt/stores";
  import Tooltip, { Wrapper } from "@smui/tooltip";
  import { enabledTrackers, selectPage } from "./config";

  let connecting = true;
  let toolTipText = "Trackers";

  function handleClick() {
    selectPage("Trackers");
  }
</script>

<div>
  {#if $enabledTrackers}
    <Wrapper>
      <img
        class="icon"
        class:connecting
        src={images["journal"].src}
        width="36"
        height="36"
        alt="Auto-Fixer Icon"
        on:click={handleClick}
      />
      <Tooltip yPos="below">{toolTipText}</Tooltip>
    </Wrapper>
  {/if}
</div>

<style>
  .icon {
    padding-top: 4px;
    padding-right: 10px;
    cursor: pointer;
  }

  .connecting {
    filter: grayscale(0);
  }
</style>
