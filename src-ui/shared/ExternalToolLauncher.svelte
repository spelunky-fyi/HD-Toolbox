<script type="ts">
  import LayoutGrid, { Cell } from "@smui/layout-grid";
  import SvelteMarkdown from "svelte-markdown";

  import { onDestroy, onMount } from "svelte";
  import ExternalToolSource from "./ExternalToolSource.svelte";
  import Button from "@smui/button/src/Button.svelte";

  import type { ExternalToolInstance } from "./external-tool-types";

  export let tool: ExternalToolInstance;

  const {
    definition,
    activeMethod,
    launchable,
    selectedFile,
    selectedVersion,
    cachedReleases,
    cachedDocs,
    releases,
    docs,
  } = tool;

  let timeout;
  let timeoutAmount = 1000 * 60;
  let mounted = false;

  async function run() {
    try {
      await docs.cacheDocs();
    } catch (err) {
      console.error(`[${definition.title}] cacheDocs failed:`, err);
    }

    if (mounted) {
      timeout = setTimeout(run, timeoutAmount);
    }
  }

  onMount(async () => {
    mounted = true;
    await run();
    try {
      await docs.loadDocs();
    } catch (err) {
      console.error(`[${definition.title}] loadDocs failed:`, err);
    }
  });

  onDestroy(() => {
    mounted = false;
    clearTimeout(timeout);
  });
</script>

<div>
  <LayoutGrid>
    <Cell span={8}>
      <div class="header">
        <h2>{definition.title}</h2>
      </div>
    </Cell>
    <Cell span={4}>
      <div class="header">
        <Button
          color="primary"
          variant="raised"
          style="margin-left: auto;"
          on:click={() =>
            releases.launch(
              $cachedReleases,
              $activeMethod,
              $selectedVersion,
              $selectedFile
            )}
          disabled={!$launchable}
        >
          Launch!
        </Button>
      </div>
    </Cell>
    <Cell span={12}>
      <ExternalToolSource {tool} on:refresh={() => docs.cacheDocs(true)} />
    </Cell>
  </LayoutGrid>
  <hr />
  <LayoutGrid>
    <Cell span={12}>
      <div style="text-align: right; margin-top: -30px; margin-bottom: 20px;">
        <small>
          The docs below auto-update but you can always check the most up to
          date version
          <a
            href={definition.docsRepoUrl}
            target="_blank"
            rel="noreferrer"
          >
            here
          </a>
        </small>
      </div>
      <SvelteMarkdown source={$cachedDocs} />
    </Cell>
  </LayoutGrid>
</div>

<style>
  .header {
    display: flex;
    align-items: center;
    height: 64px;
  }
</style>
