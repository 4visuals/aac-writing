<template>
  <div class="tab-ui">
    <TabNav :model="model" />
    <TabBody :model="model" v-if="model.hasBody()" />
    <slot v-else />
  </div>
</template>

<script>
import TabBody from "./TabBody.vue";
import TabNav from "./TabNav.vue";
export default {
  props: ["model"],
  components: {
    TabNav,
    TabBody,
  },
};
</script>
