<script type="ts">
  import { images } from "@hdt/images";
  import Tooltip, { Wrapper } from "@smui/tooltip";
  import { listen } from "@tauri-apps/api/event";
  import { invoke } from "@tauri-apps/api/tauri";
  import { enabledAutoFixer, selectPage } from "./config";
  import { autoFixerState, TaskState, RemoteTaskState } from "./tasks";

  const taskName = "AutoFixer";
  let unlistener = null;
  enabledAutoFixer.subscribe((value) => {
    if (value) {
      listen(`task-state:${taskName}`, (event) => {
        let payload: RemoteTaskState = <RemoteTaskState>event.payload;
        if (payload.type == "Connected") {
          autoFixerState.set(TaskState.Connected);
        }
        console.log(event);
      }).then((unlistenFunc) => {
        unlistener = unlistenFunc;
      });
      autoFixerState.set(TaskState.Pending);
      invoke("start_task", {
        task: { type: taskName },
      });
    } else {
      unlistener && unlistener();
      autoFixerState.set(TaskState.Disconnected);
      invoke("stop_task", { task: { type: taskName } });
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
