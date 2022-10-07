<template>
  <div class="loading">
    <span
      class="material-icons-outlined"
      :class="{ anim: !pending.error, rotate: !pending.error }"
    >
      {{ pending.error ? "error" : "sync" }}
    </span>
    <span class="text">{{ pending.text }}</span>
  </div>
</template>

<script>
export default {
  props: ["pending"],
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.loading {
  font-size: 1rem;
  display: flex;
  align-items: center;
  .material-icons-outlined {
    font-size: 1.25rem;
  }
}
</style>
