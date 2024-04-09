<template>
  <nav class="tab-nav">
    <button
      v-for="tab in tabs.items"
      :key="tab.cmd"
      @click="chooseTab(tab)"
      class="nude"
      :class="{ active: tabs.activeTab.value === tab }"
    >
      <span>{{ tab.text }}</span>
    </button>
  </nav>
</template>

<script setup>
import { defineEmits, defineProps } from "vue";
const props = defineProps(["tabs"]);
const emit = defineEmits("active");

const chooseTab = (tab) => {
  props.tabs.setActiveTab(tab);
  emit("active", tab);
};
</script>

<style lang="scss" scoped>
$inactive-color: pink;
.tab-nav {
  display: flex;
  .nude {
    flex: 1 1 auto;
    font-size: 1.35rem;
    letter-spacing: 2px;
    color: $inactive-color;
    border-bottom: 2px solid $inactive-color;
    &.active {
      background-color: #f84527;
      color: white;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      border-bottom-color: #f84527;
    }
  }
}
</style>
