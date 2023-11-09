<template>
  <button
    type="button"
    :disabled="disabled"
    :style="`--font-size: ${fsize}; --font-color: ${fcolor}`"
  >
    <span class="material-icons-outlined">{{ icon }}</span>
  </button>
</template>

<script>
export default {
  props: {
    icon: { type: String, default: "add" },
    fsize: { type: String, default: "inherit" },
    fcolor: { type: String, default: "inherit" },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup() {},
};
</script>

<style lang="scss" scoped>
button {
  color: inherit;
  font-size: var(--font-size, inherit);
  color: var(--font-color, inherit);
  background: transparent;
  border: none;
  display: block;

  &.md-1 {
    font-size: 1rem;
  }
  &.md-2 {
    font-size: 2rem;
  }
  &.md-3 {
    font-size: 3rem;
  }
  &.md-4 {
    font-size: 4rem;
  }
  &:disabled {
    color: #999 !important;
    &:hover {
      background-color: #efefef !important;
    }
  }
  .material-icons-outlined {
    font-size: inherit;
    display: block;
  }
}
</style>
