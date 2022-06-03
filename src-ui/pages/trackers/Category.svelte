<script lang="ts">
  import { writable, derived } from "svelte/store";
  import Button from "@smui/button/src/Button.svelte";
  import { Content } from "@smui/card";
  import Card from "@smui/card/src/Card.svelte";
  import Checkbox from "@smui/checkbox";
  import FormField from "@smui/form-field";
  import HelpDialog from "./HelpDialog.svelte";
  import { UserAttentionType, WebviewWindow } from "@tauri-apps/api/window";

  import {
    altNames,
    configLoaded,
    hideEarly,
    showNo,
    showNoGold,
    showPacifist,
  } from "./configs/category";
  import { trackerPort } from "@hdt/config";

  export let enabled;

  let dialogOpen = writable(false);
  let minWidth = 1700;
  let minHeight = 120;

  const url = derived(trackerPort, ($trackerPort) => {
    return `http://localhost:${$trackerPort}/category.html`;
  });
  function openTracker() {
    let window = new WebviewWindow("CategoryTracker", {
      url: $url,
      title: "HD Toolbox - Category Tracker",
      minHeight: minHeight,
      height: minHeight,
      minWidth: minWidth,
      width: minWidth,
      visible: false,
    });
    window
      .requestUserAttention(UserAttentionType.Informational)
      .catch((_reason) => {});
    window.unminimize().catch((_reason) => {});
    window.setFocus().catch((_reason) => {});
  }
</script>

{#if $configLoaded}
  <div class="card-container">
    <Card padded>
      <Content style="padding: 0px;">
        <div style="display: flex;">
          <h2 class="mdc-typography--headline6" style="margin: 0;">
            Category Tracker 🐈
          </h2>
          <div style="margin-left: auto;">
            <Button on:click={() => dialogOpen.set(true)}>Help</Button>
            <Button disabled={!$enabled} on:click={openTracker}>Open</Button>
          </div>
        </div>
      </Content>
      <Content>
        <h4 style="margin: 2px;">Modifiers</h4>
        <hr style="margin: 2px;" />
        <div>
          <FormField>
            <Checkbox bind:checked={$hideEarly} />
            <span slot="label">Hide All Before 1-3</span>
          </FormField>
        </div>
        <FormField>
          <Checkbox bind:checked={$showNo} />
          <span slot="label">No%</span>
        </FormField>
        <FormField>
          <Checkbox bind:checked={$showNoGold} />
          <span slot="label">No Gold</span>
        </FormField>
        <FormField>
          <Checkbox bind:checked={$showPacifist} />
          <span slot="label">Pacifist</span>
        </FormField>
        <hr />
        <div>
          <FormField>
            <Checkbox bind:checked={$altNames} />
            <span slot="label">Alternative Name Order</span>
          </FormField>
        </div>
      </Content>
    </Card>
  </div>
{:else}
  <div>Loading...</div>
{/if}

<HelpDialog
  title="Category Tracker"
  open={dialogOpen}
  {url}
  width={minWidth}
  height={minHeight}
>
  <h4>Custom CSS</h4>
  <code>text-align: right;</code> - Useful when aligning OBS Scene on right side.
</HelpDialog>

<style>
</style>
