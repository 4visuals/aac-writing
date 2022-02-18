<template>
  <button type="button">
    <span class="material-icons">{{ icon }}</span>
  </button>
</template>

<script>
export default {
  props: ["icon"],
  setup() {},
};
</script>

<style lang="scss" scoped>
button {
  font-size: inherit;
  background: transparent;
  border: none;
  .material-icons {
    font-size: inherit;
  }
}
</style>
