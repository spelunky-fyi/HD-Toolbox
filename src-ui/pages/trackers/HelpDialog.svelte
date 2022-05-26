<script lang="ts">
  import Dialog, {
    Title,
    Content as DialogContent,
    Actions,
    InitialFocus,
  } from "@smui/dialog";
  import Button, { Label } from "@smui/button";
  import { ClipboardIcon } from "svelte-feather-icons";
  import { writeText } from "@tauri-apps/api/clipboard";

  export let title;
  export let url;
  export let width;
  export let height;
  export let open;
</script>

<Dialog
  bind:open={$open}
  aria-labelledby="simple-title"
  aria-describedby="simple-content"
  surface$style="width: 850px; max-width: calc(100vw - 32px);"
>
  <Title id="simple-title">{title}</Title>
  <DialogContent id="simple-content">
    <dl>
      <dt>URL</dt>
      <dd>
        <Button on:click={() => writeText($url)}>
          <ClipboardIcon />
        </Button>
        <code>{$url}</code>
      </dd>
      <dt>Width</dt>
      <dd>
        <Button on:click={() => writeText(width.toString())}>
          <ClipboardIcon />
        </Button>
        <code>{width}</code>
      </dd>
      <dt>Height</dt>
      <dd>
        <Button on:click={() => writeText(height.toString())}>
          <ClipboardIcon />
        </Button>
        <code>{height}</code>
      </dd>
    </dl>
    <hr />
    <slot />
  </DialogContent>
  <Actions>
    <Button defaultAction use={[InitialFocus]}>
      <Label>Close</Label>
    </Button>
  </Actions>
</Dialog>

<style>
  dl {
    display: grid;
    grid-template-columns: max-content auto;
  }

  dt {
    grid-column-start: 1;
    align-items: center;
    display: flex;
    margin: 5px 0;
    font-weight: bold;
    justify-content: right;
    margin-inline-start: 10px;
  }

  dd {
    grid-column-start: 2;
    align-items: center;
    display: flex;
    margin-inline-start: 30px;
  }
</style>
