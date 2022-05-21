<script type="ts">
  import { images } from "@hdt/images";
  import Tooltip, { Wrapper } from "@smui/tooltip";
  import { enabledAutoFixer, selectPage } from "./config";
  import { autoFixerState, Task, TaskState } from "./tasks";

  const taskName = "AutoFixer";
  let task = new Task(taskName, autoFixerState);
  enabledAutoFixer.subscribe((value) => {
    if (value) {
      task.start();
    } else {
      task.stop();
    }
  });

  function handleClick() {
    selectPage("Memory Updater");
  }
</script>

<div>
  {#if $enabledAutoFixer}
    <Wrapper>
      <img
        class="icon"
        class:connecting={$autoFixerState === TaskState.Pending}
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
    filter: grayscale(1);
  }
</style>
