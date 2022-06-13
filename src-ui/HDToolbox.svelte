<script lang="ts">
  import HDDrawer from "@hdt/Drawer.svelte";
  import type { TopAppBarComponentDev } from "@smui/top-app-bar";
  import TopAppBar, {
    Row,
    Section,
    Title,
    AutoAdjust,
  } from "@smui/top-app-bar";
  import AutoFixerIcon from "./AutoFixerIcon.svelte";
  import TrackersIcon from "./TrackersIcon.svelte";
  import { configLoaded } from "./config";
  import { imagesLoaded } from "./images";
  import { writable } from "svelte/store";
  import { getVersion } from "@tauri-apps/api/app";

  const version = writable("");
  getVersion().then((data) => {
    console.log(data);
    version.set(data);
  });

  function disableMenu() {
    // if (window.location.hostname !== "tauri.localhost") {
    //   return;
    // }

    document.addEventListener(
      "contextmenu",
      (e) => {
        e.preventDefault();
        return false;
      },
      { capture: true }
    );
  }

  disableMenu();

  let topAppBar: TopAppBarComponentDev;
</script>

{#if $imagesLoaded && $configLoaded}
  <TopAppBar bind:this={topAppBar} variant="standard" dense>
    <Row>
      <Section>
        <Title>HD Toolbox</Title>
        {#if $version !== ""}
          <span class="version">
            v{$version}
          </span>
        {/if}
      </Section>
      <Section align="end" toolbar>
        <div class="icons">
          <TrackersIcon />
          <AutoFixerIcon />
        </div>
      </Section>
    </Row>
  </TopAppBar>
  <AutoAdjust class="top-bar-content" {topAppBar}>
    <HDDrawer />
  </AutoAdjust>
{:else}
  <div />
{/if}

<style>
  :global(.top-bar-content) {
    height: 100%;
    box-sizing: border-box;
  }

  .icons {
    display: flex;
    align-items: center;
  }

  .version {
    padding-left: 5px;
    margin-top: 2px;
    font-size: smaller;
    font-style: italic;
  }
</style>
