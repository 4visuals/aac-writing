<template>
  <div class="tab-nav">
    <div
      class="tab"
      :class="{ active: model.activeTab.value === tab }"
      v-for="(tab, index) in model.items"
      :key="index"
      @click="tabClicked(tab)"
    >
      <SpanText size="sm">{{ tab.text }}</SpanText>
    </div>
  </div>
</template>

<script>
import { SpanText } from "@/components/text";
export default {
  components: {
    SpanText,
  },
  props: ["model"],
  setup(props) {
    const tabClicked = (tab) => {
      props.model.setActiveTab(tab);
    };
    return { tabClicked };
  },
};
</script>

<style lang="scss" scoped>
.tab-nav {
  display: flex;
  .tab {
    padding: 0.4rem 0.8rem;
    cursor: pointer;
    user-select: none;
    &.active {
      background-color: rgb(203, 231, 255);
    }
  }
}
</style>
