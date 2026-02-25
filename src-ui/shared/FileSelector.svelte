<script type="ts">
  import { open } from "@tauri-apps/api/dialog";
  import Button from "@smui/button/src/Button.svelte";
  import type { Writable } from "svelte/store";

  export let selectedFile: Writable<string>;
  export let filterName: string = "File";
  export let filterExtensions: string[] = ["dll"];
  export let chooseLabel: string = "Choose File";

  async function chooseFile(_event) {
    const file = (await open({
      multiple: false,
      filters: [
        {
          name: filterName,
          extensions: filterExtensions,
        },
      ],
    })) as string;
    selectedFile.set(file);
  }
</script>

<div>
  <label for="find-file">&nbsp;</label>
  <Button
    id="find-file"
    variant="raised"
    color="primary"
    height="43px"
    on:click={chooseFile}
  >
    {chooseLabel}
  </Button>
  {#if $selectedFile}
    <span>{$selectedFile}</span>
  {:else}
    <span>No file selected...</span>
  {/if}
</div>

<style>
  :global(#find-file) {
    height: 43px;
    margin-top: 5px;
  }
</style>
