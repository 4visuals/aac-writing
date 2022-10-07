<template>
  <span
    class="i material-icons-outlined"
    :style="`--icon-font-size: ${fsize || '18px'} `"
  >
    {{ icon }}
  </span>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: "add",
    },
    fsize: {
      type: String,
    },
  },
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.i.material-icons-outlined {
  font-size: var(--icon-font-size, 18px);
}
</style>
