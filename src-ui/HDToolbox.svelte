<script lang="ts">
  import Drawer, { AppContent, Content } from "@smui/drawer";
  import List, { Item, Text } from "@smui/list";
  import type { TopAppBarComponentDev } from "@smui/top-app-bar";
  import TopAppBar, {
    Row,
    Section,
    Title,
    AutoAdjust,
  } from "@smui/top-app-bar";

  let topAppBar: TopAppBarComponentDev;
</script>

<TopAppBar bind:this={topAppBar} variant="standard" dense>
  <Row>
    <Section>
      <Title>HD Toolbox</Title>
    </Section>
    <Section align="end" toolbar />
  </Row>
</TopAppBar>
<AutoAdjust class="top-bar-content" {topAppBar}>
  <div class="drawer-container">
    <Drawer>
      <Content>
        <List>
          <Item href="javascript:void(0)">
            <Text>Home</Text>
          </Item>
        </List>
      </Content>
    </Drawer>
    <AppContent class="app-content" />
  </div>
</AutoAdjust>

<style>
  :global(.top-bar-content) {
    height: 100%;
    box-sizing: border-box;
  }

  /* These classes are only needed because the
    drawer is in a container on the page. */
  .drawer-container {
    position: relative;
    display: flex;
    height: 100%;

    flex-grow: 1;
    overflow: hidden;
    z-index: 0;
  }
  * :global(.app-content) {
    overflow: auto;
    position: relative;
    flex-direction: column;
    width: 100%;
    flex: 0 0 100%; /* Let it fill the entire space horizontally */

    box-sizing: border-box;
  }
</style>
