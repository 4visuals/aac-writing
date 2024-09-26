<template>
  <div class="tab-ui">
    <TabNav :model="model" />
    <TabBody :model="model" v-if="model.hasBody()" />
    <slot v-else />
  </div>
</template>

<script setup>
import TabBody from "./TabBody.vue";
import TabNav from "./TabNav.vue";
import { defineProps } from "vue";

defineProps(["model"]);
</script>
