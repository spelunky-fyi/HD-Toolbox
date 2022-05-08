<script lang="ts">
  import HDDrawer from "./Drawer.svelte";
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
  <HDDrawer />
</AutoAdjust>

<style>
  :global(.top-bar-content) {
    height: 100%;
    box-sizing: border-box;
  }
</style>
