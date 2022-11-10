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
    enableRunStats,
    showRunScoreStats,
    showRunSpeedStats,
    showRunIl,
    showRunArea,
    showRunPace,
    enableSessionStats,
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
  let width = 1700;
  let height = 120;

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
        maxHeight: height * 20,
        minWidth: width / 2,
        width: width,
        maxWidth: width * 20,
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
        <div
          class="tracker-config {$enableSessionStats
            ? ''
            : 'tracker-config-disabled'}"
        >
          <h4 style="margin: 2px;">Session Config</h4>
          <hr style="margin: 2px;" />
          <div>
            <FormField>
              <Checkbox bind:checked={$enableSessionStats} />
              <span slot="label">Enable Session Stats</span>
            </FormField>
          </div>
          <div>
            <FormField>
              <Checkbox
                bind:checked={$showSessionRuns}
                disabled={!$enableSessionStats}
              />
              <span slot="label">Show Runs</span>
            </FormField>
            <FormField>
              <Checkbox
                bind:checked={$showSessionDeaths}
                disabled={!$enableSessionStats}
              />
              <span slot="label">Show Deaths</span>
            </FormField>
            <FormField>
              <Checkbox
                bind:checked={$showSessionWins}
                disabled={!$enableSessionStats}
              />
              <span slot="label">Show Wins</span>
            </FormField>
            <FormField>
              <Checkbox
                bind:checked={$showSessionKills}
                disabled={!$enableSessionStats}
              />
              <span slot="label">Show Kills</span>
            </FormField>
            <FormField>
              <Checkbox
                bind:checked={$showSessionScore}
                disabled={!$enableSessionStats}
              />
              <span slot="label">Show Score</span>
            </FormField>
            <FormField>
              <Checkbox
                bind:checked={$showSessionTime}
                disabled={!$enableSessionStats}
              />
              <span slot="label">Show Time</span>
            </FormField>
          </div>
        </div>
        <div
          class="tracker-config {$enableRunStats
            ? ''
            : 'tracker-config-disabled'}"
        >
          <h4 style="margin: 2px;">Run Config</h4>
          <hr style="margin: 2px;" />
          <div>
            <FormField>
              <Checkbox bind:checked={$enableRunStats} />
              <span slot="label">Enable Run Stats</span>
            </FormField>
          </div>
          <div>
            <FormField>
              <Checkbox
                bind:checked={$showRunSpeedStats}
                disabled={!$enableRunStats}
              />
              <span slot="label">Show Speed Stats</span>
            </FormField>
            <FormField>
              <Checkbox
                bind:checked={$showRunScoreStats}
                disabled={!$enableRunStats}
              />
              <span slot="label">Show Score Stats</span>
            </FormField>
          </div>
          <div>
            <FormField>
              <Checkbox bind:checked={$showRunIl} disabled={!$enableRunStats} />
              <span slot="label">Show ILs</span>
            </FormField>
            <FormField>
              <Checkbox
                bind:checked={$showRunArea}
                disabled={!$enableRunStats}
              />
              <span slot="label">Show Area</span>
            </FormField>
            <FormField>
              <Checkbox
                bind:checked={$showRunPace}
                disabled={!$enableRunStats}
              />
              <span slot="label">Show Pace</span>
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
  .tracker-config-disabled :global(.mdc-form-field) {
    color: grey;
  }
</style>
