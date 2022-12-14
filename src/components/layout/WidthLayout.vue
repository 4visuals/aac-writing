<template>
  <div class="layout-w" :style="`--max-width: ${maxw}`"><slot /></div>
</template>

<script>
import { computed } from "vue";

export default {
  props: {
    maxWidth: {
      type: String,
      default: "400px",
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
}
</style>
