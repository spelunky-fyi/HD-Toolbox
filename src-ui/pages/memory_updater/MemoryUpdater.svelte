<script type="ts">
  import LayoutGrid, { Cell } from "@smui/layout-grid";
  import Card, { Content } from "@smui/card";

  import CharList from "./CharList.svelte";
  import SlowLook from "./SlowLook.svelte";
  import { onDestroy, onMount } from "svelte";
  import {
    memoryUpdaterData,
    memoryUpdaterState,
    Task,
    TaskState,
  } from "@hdt/tasks";
  import AutoFixer from "./AutoFixer.svelte";

  const connectingText = "Looking for running Spelunky.exe...";

  const taskName = "MemoryUpdater";
  let task: Task;

  onMount(() => {
    task = new Task(taskName, memoryUpdaterState, memoryUpdaterData);
    task.start();
  });
  onDestroy(() => {
    task && task.stop();
  });
</script>

<div>
  {#if $memoryUpdaterState == TaskState.Pending}
    <p class="card-container">
      <Card padded>
        <div class="connecting-text">
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
    <AutoFixer connecting={$memoryUpdaterState == TaskState.Pending} />
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
