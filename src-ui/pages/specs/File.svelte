<script type="ts">
  import { open } from "@tauri-apps/api/dialog";
  import Button from "@smui/button/src/Button.svelte";
  import { selectedFile } from "./config";

  async function getDll(_event) {
    const dll = (await open({
      multiple: false,
      filters: [
        {
          name: "Specs DLL",
          extensions: ["dll"],
        },
      ],
    })) as string;
    selectedFile.set(dll);
  }
</script>

<div>
  <label for="find-dll">&nbsp;</label>
  <Button
    id="find-dll"
    variant="raised"
    color="primary"
    height="43px"
    on:click={getDll}
  >
    Choose DLL
  </Button>
  {#if $selectedFile}
    <span>{$selectedFile}</span>
  {:else}
    <span>No file selected...</span>
  {/if}
</div>

<style>
  :global(#find-dll) {
    height: 43px;
    margin-top: 5px;
  }
</style>
