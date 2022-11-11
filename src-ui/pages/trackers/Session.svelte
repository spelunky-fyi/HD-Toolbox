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
    configLoaded,
    showSessionRuns,
    showSessionDeaths,
    showSessionWins,
    showSessionKills,
    showSessionTime,
    showSessionScore,
  } from "./configs/session";
  import { trackerPort } from "@hdt/config";

  export let enabled;

  let dialogOpen = writable(false);
  let width = 1600;
  let height = 70;

  const label = "SessionTracker";
  const url = derived(trackerPort, ($trackerPort) => {
    return `http://localhost:${$trackerPort}/session.html`;
  });

  async function openTracker() {
    let window = WebviewWindow.getByLabel(label);

    if (!window) {
      window = new WebviewWindow(label, {
        url: $url,
        title: "HD Toolbox - Session Tracker",
        minHeight: height / 2,
        height: height,
        maxHeight: height * 2,
        minWidth: width / 2,
        width: width,
        maxWidth: width * 2,
        visible: true,
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
            Session Tracker
          </h2>
          <div style="margin-left: auto;">
            <Button on:click={() => dialogOpen.set(true)}>Help</Button>
            <Button disabled={!$enabled} on:click={openTracker}>Open</Button>
          </div>
        </div>
      </Content>
      <Content>
        <div class="tracker-config">
          <div>
            <FormField>
              <Checkbox bind:checked={$showSessionRuns} />
              <span slot="label">Show Runs</span>
            </FormField>
            <FormField>
              <Checkbox bind:checked={$showSessionDeaths} />
              <span slot="label">Show Deaths</span>
            </FormField>
            <FormField>
              <Checkbox bind:checked={$showSessionWins} />
              <span slot="label">Show Wins</span>
            </FormField>
            <FormField>
              <Checkbox bind:checked={$showSessionKills} />
              <span slot="label">Show Kills</span>
            </FormField>
            <FormField>
              <Checkbox bind:checked={$showSessionScore} />
              <span slot="label">Show Score</span>
            </FormField>
            <FormField>
              <Checkbox bind:checked={$showSessionTime} />
              <span slot="label">Show Time</span>
            </FormField>
          </div>
        </div>
      </Content>
    </Card>
  </div>
{:else}
  <div>Loading...</div>
{/if}

<HelpDialog title="Session Tracker" open={dialogOpen} {url} {width} {height}>
  <h4>Custom CSS</h4>
  <code>text-align: right;</code> - Useful when aligning OBS Scene on right side.
</HelpDialog>

<style>
</style>
