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
  import { configLoaded } from "./config";
  import { imagesLoaded } from "./stores";
  import TrackersIcon from "./TrackersIcon.svelte";

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

  function disableSelect() {
    window.addEventListener("selectstart", function (event) {
      event.preventDefault();
    });
  }

  disableMenu();
  disableSelect();

  let topAppBar: TopAppBarComponentDev;
</script>

{#if $imagesLoaded && $configLoaded}
  <TopAppBar bind:this={topAppBar} variant="standard" dense>
    <Row>
      <Section>
        <Title>HD Toolbox</Title>
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
</style>
