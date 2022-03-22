<template>
  <button>
    <span class="material-icons-outlined">{{ icon }}</span>
  </button>
</template>

<script>
export default {
  props: ["icon", "theme"],
  setup() {},
};
</script>

<style lang="scss" scoped>
button {
  border: none;
  outline: none;
}
</style>
