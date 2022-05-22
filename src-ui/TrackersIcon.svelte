<script type="ts">
  import { images } from "@hdt/images";
  import Tooltip, { Wrapper } from "@smui/tooltip";
  import { enabledTrackers, selectPage, trackerPort } from "./config";
  import { Task, TaskState, trackersFailMessage, trackersState } from "./tasks";

  import { get } from "svelte/store";

  const toolTipText = "Trackers";
  const taskName = "WebServer";

  let task = new Task(taskName, trackersState, null, trackersFailMessage);
  enabledTrackers.subscribe((value) => {
    if (value) {
      task.start({ port: get(trackerPort) });
    } else {
      task.stop();
      trackersFailMessage.set("");
    }
  });

  function handleClick() {
    selectPage("Trackers");
  }
</script>

<div>
  {#if $enabledTrackers}
    <Wrapper>
      <img
        class="icon"
        class:connecting={$trackersState === TaskState.Pending}
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
    filter: grayscale(1);
  }
</style>
