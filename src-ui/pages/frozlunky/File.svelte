<script type="ts">
  import { open } from "@tauri-apps/api/dialog";
  import Button from "@smui/button/src/Button.svelte";
  import { selectedFile } from "./config";

  async function getExe(_event) {
    const exe = (await open({
      multiple: false,
      filters: [
        {
          name: "Frozlunky",
          extensions: ["exe"],
        },
      ],
    })) as string;
    selectedFile.set(exe);
  }
</script>

<div>
  <label for="find-exe">&nbsp;</label>
  <Button
    id="find-exe"
    variant="raised"
    color="primary"
    height="43px"
    on:click={getExe}
  >
    Choose EXE
  </Button>
  {#if $selectedFile}
    <span>{$selectedFile}</span>
  {:else}
    <span>No file selected...</span>
  {/if}
</div>

<style>
  :global(#find-exe) {
    height: 43px;
    margin-top: 5px;
  }
</style>
