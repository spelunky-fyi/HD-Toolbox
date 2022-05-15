<script type="ts">
  import LayoutGrid, { Cell } from "@smui/layout-grid";
  import Card, { Content } from "@smui/card";
  import CircularProgress from "@smui/circular-progress";

  import CharList from "./CharList.svelte";
  import SlowLook from "./SlowLook.svelte";
  import { onMount } from "svelte";

  let connecting = true;
  const connectingText = "Looking for running Spelunky.exe...";

  onMount(() => {
    setTimeout(() => {
      connecting = false;
    }, 2000);
  });
</script>

<div>
  {#if connecting}
    <p class="card-container">
      <Card padded>
        <div class="connecting-text">
          <CircularProgress
            style="height: 32px; width: 32px; margin-right: 10px;"
            indeterminate
          />
          <span>{connectingText}</span>
        </div>
      </Card>
    </p>
  {/if}
</div>
<LayoutGrid>
  <Cell class="char-list" span={7}>
    <CharList {connecting} />
  </Cell>
  <Cell span={5}>
    <SlowLook {connecting} />
  </Cell>
</LayoutGrid>

<style>
  .connecting-text {
    display: flex;
    align-items: center;
    color: rgb(255, 192, 55);
  }
  p.card-container {
    margin: 0px;
    position: fixed;
    bottom: 0;
    right: 0;
  }
</style>
