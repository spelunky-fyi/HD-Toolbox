<script type="ts">
  import LayoutGrid, { Cell } from "@smui/layout-grid";
  import Card, { Content } from "@smui/card";
  import CircularProgress from "@smui/circular-progress";

  import CharList from "./CharList.svelte";
  import SlowLook from "./SlowLook.svelte";
  import { onDestroy, onMount } from "svelte";
  import { memoryUpdaterState, RemoteTaskState, TaskState } from "@hdt/tasks";
  import { invoke } from "@tauri-apps/api/tauri";
  import { listen } from "@tauri-apps/api/event";

  const connectingText = "Looking for running Spelunky.exe...";
  const taskName = "MemoryUpdater";
  let unlistener = null;

  onMount(() => {
    listen(`task-state:${taskName}`, (event) => {
      let payload: RemoteTaskState = <RemoteTaskState>event.payload;
      if (payload.type == "Connected") {
        memoryUpdaterState.set(TaskState.Connected);
      }
      console.log(event);
    }).then((unlistenFunc) => {
      unlistener = unlistenFunc;
    });
    memoryUpdaterState.set(TaskState.Pending);
    invoke("start_task", {
      task: { type: taskName },
    });
  });

  onDestroy(() => {
    unlistener && unlistener();
    memoryUpdaterState.set(TaskState.Disconnected);
    invoke("stop_task", { task: { type: taskName } });
  });
</script>

<div>
  {#if $memoryUpdaterState == TaskState.Pending}
    <p class="card-container">
      <Card padded>
        <div class="connecting-text">
          <CircularProgress
            style="height: 32px; width: 32px; margin-right: 10px;"
            indeterminate
          />
          <span>{connectingText}</span>
        </div>
      </Card>
    </p>
  {/if}
</div>
<LayoutGrid>
  <Cell class="char-list" span={7}>
    <CharList connecting={$memoryUpdaterState == TaskState.Pending} />
  </Cell>
  <Cell span={5}>
    <SlowLook connecting={$memoryUpdaterState == TaskState.Pending} />
  </Cell>
</LayoutGrid>

<style>
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
