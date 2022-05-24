<script lang="ts">
  import Button from "@smui/button/src/Button.svelte";
  import { Content } from "@smui/card";
  import Card from "@smui/card/src/Card.svelte";
  import Checkbox from "@smui/checkbox";
  import FormField from "@smui/form-field";
  import {
    hideEarly,
    showNo,
    showNoGold,
    showPacifist,
  } from "./configs/category";
</script>

<div class="card-container">
  <Card padded>
    <Content style="padding: 0px;">
      <div style="display: flex;">
        <h2 class="mdc-typography--headline6" style="margin: 0;">
          Category Tracker
        </h2>
        <Button style="margin-left: auto;">Open</Button>
      </div>
    </Content>
    <Content>
      <h4 style="margin: 2px;">Modifiers</h4>
      <hr style="margin: 2px;" />
      <div>
        <FormField>
          <Checkbox bind:checked={$hideEarly} />
          <span slot="label">Hide All Before 1-3</span>
        </FormField>
      </div>
      <FormField>
        <Checkbox bind:checked={$showNo} />
        <span slot="label">No%</span>
      </FormField>
      <FormField>
        <Checkbox bind:checked={$showNoGold} />
        <span slot="label">No Gold</span>
      </FormField>
      <FormField>
        <Checkbox bind:checked={$showPacifist} />
        <span slot="label">Pacifist</span>
      </FormField>
    </Content>
  </Card>
</div>

<style>
</style>
