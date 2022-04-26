<template>
  <div class="tab-body">
    <component
      :is="model.activeTab.value._body.comp"
      v-bind="{ ...model.activeTab.value._body.args }"
      v-on="{ ...model.activeTab.value._body.events }"
    />
  </div>
</template>

<script>
import { watch } from "@vue/runtime-core";
export default {
  props: ["model"],
  setup(props) {
    watch(
      () => props.model.activeTab,
      (tab) => {
        console.log("[changed]", tab);
      }
    );
  },
};
</script>

<style></style>
