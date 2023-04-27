<template>
  <div
    class="layout-w"
    :class="{
      fixed,
      left: align === 'left',
      right: align === 'right',
      center: align === 'center',
    }"
    :style="`--max-width: ${maxw}`"
  >
    <slot />
  </div>
</template>

<script>
import { computed } from "vue";

export default {
  props: {
    align: {
      type: String,
      default: "center",
    },
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
  &.left {
    margin: 0 auto 0 0;
  }
  &.center {
    margin: 0 auto;
  }
  &.right {
    margin: 0 auto 0 0;
  }
  &.fixed {
    position: sticky;
    top: 0;
    z-index: 100;
  }
}
</style>
