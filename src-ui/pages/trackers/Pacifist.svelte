<script lang="ts">
  import Button from "@smui/button/src/Button.svelte";
  import { Content } from "@smui/card";
  import Actions from "@smui/card/src/Actions.svelte";
  import Card from "@smui/card/src/Card.svelte";
  import Checkbox from "@smui/checkbox";
  import FormField from "@smui/form-field";
  import { showKills } from "./configs/pacifist";
</script>

<div class="card-container">
  <Card padded>
    <Content style="padding: 0px;">
      <div style="display: flex;">
        <h2 class="mdc-typography--headline6" style="margin: 0;">
          Pacifist Tracker
        </h2>
        <Button style="margin-left: auto;">Open</Button>
      </div>
    </Content>
    <Content>
      <h4 style="margin: 2px;">Options</h4>
      <hr style="margin: 2px;" />
      <FormField>
        <Checkbox bind:checked={$showKills} />
        <span slot="label">Show Kill Count</span>
      </FormField>
    </Content>
  </Card>
</div>

<style>
</style>
