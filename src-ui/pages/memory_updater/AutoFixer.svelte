<script type="ts">
  import Switch from "@smui/switch/src/Switch.svelte";
  import FormField from "@smui/form-field";

  import { autoFixerHeader, enabledAutoFixer } from "@hdt/config";
  import {
    autoFixSlowLook,
    autoFixCharacters,
    desiredCharacters,
  } from "./config";
  import { memoryUpdaterData } from "@hdt/tasks";

  export let connecting = false;

  function handleLockCharactersClick() {
    $autoFixCharacters = !$autoFixCharacters;
    if ($autoFixCharacters) {
      desiredCharacters.set($memoryUpdaterData.chars);
    }
  }
</script>

<div class="auto-fixer">
  <div>
    <div class="auto-fixer-header">
      <h2>Auto-Fixer</h2>
      <Switch bind:checked={$enabledAutoFixer} />
      <div
        class="switch-state"
        class:disabled={!$enabledAutoFixer}
        class:enabled={$enabledAutoFixer}
      >
        {$autoFixerHeader}
      </div>
    </div>
    <p style="margin-top: 0px;">
      The Auto-Fixer is a process that will keep certain settings synced with
      the game.
    </p>
    <div>
      <FormField>
        <Switch color="primary" bind:checked={$autoFixSlowLook} />
        <span slot="label" style="font-weight: bold;">Fix Slow Look</span>
      </FormField>
    </div>
    <div>
      <FormField>
        <Switch
          disabled={connecting}
          color="primary"
          checked={$autoFixCharacters}
          on:SMUISwitch:change={handleLockCharactersClick}
        />
        <span slot="label" style="font-weight: bold;">Freeze Characters</span>
      </FormField>
    </div>
  </div>
</div>

<style>
  div.auto-fixer-header > h2 {
    border-right: 1px solid white;
    padding-right: 25px;
    margin-right: 10px;
    margin-bottom: 5px;
  }
  .auto-fixer-header {
    display: flex;
    align-items: center;
  }
  .switch-state.enabled {
    color: rgb(18, 239, 18);
  }

  .switch-state.disabled {
    color: rgb(255, 73, 73);
  }
</style>
