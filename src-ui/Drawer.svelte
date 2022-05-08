<script lang="ts">
  import Drawer, { Content } from "@smui/drawer";
  import List, { Item, Text } from "@smui/list";
  import HDContent from "./Content.svelte";
</script>

<div class="drawer-container">
  <Drawer>
    <Content>
      <div class="drawer-lists">
        <div class="drawer-nav">
          <List>
            <Item activated={true} href="javascript:void(0)">
              <Text>Home</Text>
            </Item>
          </List>
        </div>
        <div class="play-button">
          <List>
            <hr />
            <Item href="javascript:void(0)">
              <Text>Play!</Text>
            </Item>
          </List>
        </div>
      </div>
    </Content>
  </Drawer>
  <HDContent />
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
</style>
