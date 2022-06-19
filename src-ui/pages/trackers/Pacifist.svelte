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
  let width = 520;
  let height = 120;

  const label = "PacifistTracker";
  const url = derived(trackerPort, ($trackerPort) => {
    return `http://localhost:${$trackerPort}/pacifist.html`;
  });

  async function openTracker() {
    let window = WebviewWindow.getByLabel(label);

    if (!window) {
      window = new WebviewWindow(label, {
        url: $url,
        title: "HD Toolbox - Pacifist Tracker",
        minHeight: height / 2,
        height: height,
        maxHeight: height * 2,
        minWidth: width / 2,
        width: width,
        maxWidth: width * 2,
        visible: false,
      });
    } else {
      await window.requestUserAttention(UserAttentionType.Informational);
      await window.unminimize();
      await window.setFocus();
    }
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

<HelpDialog title="Pacifist Tracker" open={dialogOpen} {url} {width} {height}>
  <h4>Custom CSS</h4>
  <code>text-align: right;</code> - Useful when aligning OBS Scene on right side.
</HelpDialog>

<style>
</style>
