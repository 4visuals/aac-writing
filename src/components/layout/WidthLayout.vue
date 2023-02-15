<template>
  <div class="layout-w" :class="{ fixed }" :style="`--max-width: ${maxw}`">
    <slot />
  </div>
</template>

<script>
import { computed } from "vue";

export default {
  props: {
    maxWidth: {
      type: String,
      default: "400px",
    },
    fixed: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const maxw = computed(() => props.maxWidth);
    return { maxw };
  },
};
</script>

<style lang="scss" scoped>
.layout-w {
  max-width: var(--max-width);
  width: 100%;
  margin: 0 auto;
  &.fixed {
    position: sticky;
    top: 0;
    z-index: 100;
  }
}
</style>
