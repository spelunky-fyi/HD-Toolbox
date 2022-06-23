<script lang="ts">
  import { invoke } from "@tauri-apps/api/tauri";

  import Drawer, { AppContent, Content } from "@smui/drawer";
  import List, { Item, Text } from "@smui/list";

  import Assets from "@hdt/pages/Assets.svelte";
  import Trackers from "@hdt/pages/trackers/Trackers.svelte";
  import LevelViewer from "@hdt/pages/level_viewer/LevelViewer.svelte";
  import MemoryUpdater from "./pages/memory_updater/MemoryUpdater.svelte";
  import { activeTab, selectPage } from "./config";
  import Specs from "./pages/specs/Specs.svelte";

  function launch_spelunky_hd() {
    invoke("launch_spelunky_hd")
      .then((msg) => console.log("Success:", msg))
      .catch((err) => console.log("Error:", err));
  }

  let pages = {
    // Assets: Assets,
    "Level Viewer": LevelViewer,
    Trackers: Trackers,
    "Memory Updater": MemoryUpdater,
    Specs: Specs,
  };
</script>

<div class="drawer-container">
  <Drawer>
    <Content>
      <div class="drawer-lists">
        <div class="drawer-nav">
          <List>
            {#each Object.keys(pages) as name}
              <Item
                activated={$activeTab === name}
                on:click={() => selectPage(name)}
              >
                <Text>{name}</Text>
              </Item>
            {/each}
          </List>
        </div>
        <div class="play-button">
          <List>
            <hr />
            <Item on:click={launch_spelunky_hd}>
              <img height="30" alt="Spelunky Logo" src="/images/idol.png" />
              <span style="padding: 10px;">
                <Text>Launch Spelunky HD!</Text>
              </span>
            </Item>
          </List>
        </div>
      </div>
    </Content>
  </Drawer>

  <AppContent class="app-content">
    <svelte:component this={pages[$activeTab]} />
  </AppContent>
</div>

<style>
  /* These classes are only needed because the
    drawer is in a container on the page. */
  .drawer-container {
    position: relative;
    display: flex;
    height: 100%;

    flex-grow: 1;
    z-index: 0;
  }

  .drawer-lists {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
  }

  .drawer-nav {
    flex-grow: 1;
    width: 100%;
  }

  .play-button {
    width: 100%;
  }

  * :global(.app-content) {
    overflow: auto;
    position: relative;
    width: 100%;

    box-sizing: border-box;
  }
</style>
