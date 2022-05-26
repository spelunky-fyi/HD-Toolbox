<script lang="ts">
  import { writable, derived } from "svelte/store";

  import Button, { Label } from "@smui/button";
  import { Content } from "@smui/card";
  import Card from "@smui/card/src/Card.svelte";
  import Checkbox from "@smui/checkbox";
  import FormField from "@smui/form-field";
  import { UserAttentionType, WebviewWindow } from "@tauri-apps/api/window";

  import { trackerPort } from "@hdt/config";
  import { configLoaded, showKills } from "./configs/pacifist";
  import HelpDialog from "./HelpDialog.svelte";

  export let enabled;

  let dialogOpen = writable(false);
  let minWidth = 520;
  let minHeight = 120;

  const url = derived(trackerPort, ($trackerPort) => {
    return `http://localhost:${$trackerPort}/pacifist.html`;
  });

  function openTracker() {
    let window = new WebviewWindow("PacifistTracker", {
      url: $url,
      title: "HD Toolbox - Pacifist Tracker",
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
            Pacifist Tracker
          </h2>
          <div style="margin-left: auto;">
            <Button on:click={() => dialogOpen.set(true)}>Help</Button>
            <Button disabled={!$enabled} on:click={openTracker}>Open</Button>
          </div>
        </div>
      </Content>
      <Content>
        <h4 style="margin: 2px;">Options</h4>
        <hr style="margin: 2px;" />
        <FormField>
          <Checkbox bind:checked={$showKills} />
          <span slot="label">Show Kill Count</span>
        </FormField>
      </Content>
    </Card>
  </div>
{:else}
  <div>Loading...</div>
{/if}

<HelpDialog
  title="Pacifist Tracker"
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
