<script type="ts">
  import { images } from "@hdt/images";
  import Tooltip, { Wrapper } from "@smui/tooltip";
  import { enabledTrackers, selectPage, trackerPort } from "./config";
  import { invoke } from "@tauri-apps/api/tauri";
  import {
    TaskState,
    trackersFailMessage,
    trackersState,
    RemoteTaskState,
  } from "./tasks";
  import { get } from "svelte/store";
  import { listen } from "@tauri-apps/api/event";

  const toolTipText = "Trackers";

  let unlistener = null;
  const taskName = "WebServer";
  enabledTrackers.subscribe((value) => {
    if (value) {
      listen(`task-state:${taskName}`, (event) => {
        let payload: RemoteTaskState = <RemoteTaskState>event.payload;
        if (payload.type == "Connected") {
          trackersState.set(TaskState.Connected);
        }
        console.log(event);
      }).then((unlistenFunc) => {
        unlistener = unlistenFunc;
      });

      trackersState.set(TaskState.Pending);
      invoke("start_task", {
        task: { type: taskName, port: get(trackerPort) },
      });
    } else {
      unlistener && unlistener();
      trackersState.set(TaskState.Disconnected);
      invoke("stop_task", { task: { type: taskName } });
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
