<script type="ts">
  import { images } from "@hdt/stores";
  import Tooltip, { Wrapper } from "@smui/tooltip";
  import { enabledAutoFixer, selectPage } from "./config";

  let connecting = true;

  function handleClick() {
    selectPage("Memory Updater");
  }
</script>

<div>
  {#if $enabledAutoFixer}
    <Wrapper>
      <img
        class="icon"
        class:connecting
        src={images["olmec-smile"].src}
        width="36"
        height="36"
        alt="Auto-Fixer Icon"
        on:click={handleClick}
      />
      <Tooltip yPos="below">Slow Look Auto-Fixer</Tooltip>
    </Wrapper>
  {/if}
</div>

<style>
  .icon {
    padding-right: 10px;
    cursor: pointer;
  }

  .connecting {
    animation: gray 3s;
    animation-iteration-count: infinite;
    transition-timing-function: ease-in-out;
  }

  @keyframes gray {
    0%,
    100% {
      filter: grayscale(0);
    }
    50% {
      filter: grayscale(1);
    }
  }
</style>
