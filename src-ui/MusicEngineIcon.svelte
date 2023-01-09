<script type="ts">
  import { images } from "@hdt/images";
  import Tooltip, { Wrapper } from "@smui/tooltip";
  import { enabledMusicEngine, selectPage } from "./config";
  import {
    Task,
    TaskState,
    musicEngineFailMessage,
    musicEngineState,
  } from "./tasks";

  import { get } from "svelte/store";

  const toolTipText = "Music Engine";
  const taskName = "MusicEngine";

  let task = new Task(taskName, musicEngineState, null, musicEngineFailMessage);
  enabledMusicEngine.subscribe((value) => {
    if (value) {
      task.start();
    } else {
      task.stop();
      musicEngineFailMessage.set("");
    }
  });

  function handleClick() {
    selectPage("Music Engine");
  }
</script>

<div>
  {#if $enabledMusicEngine}
    <Wrapper>
      <img
        class="icon"
        class:connecting={$musicEngineState === TaskState.Pending}
        src={images["hedjet"].src}
        width="36"
        height="36"
        alt="Music Engine Icon"
        on:keypress={handleClick}
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
