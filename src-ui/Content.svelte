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
</script>

<AppContent class="app-content">
  <pre>
    Content
  </pre>
</AppContent>

<style>
  * :global(.app-content) {
    overflow: auto;
    position: relative;
    width: 100%;

    box-sizing: border-box;
  }
</style>
