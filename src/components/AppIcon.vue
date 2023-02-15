<template>
  <span
    class="i material-icons-outlined"
    :style="`--icon-font-size: ${fsize} `"
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
      default: "18px",
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
