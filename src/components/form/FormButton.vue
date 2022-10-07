<template>
  <button
    class="nude"
    :class="{ round, blue: theme === 'blue', sm: size === 'sm' }"
  >
    <span v-if="icon" class="left icon material-icons-outlined">
      {{ icon }} </span
    ><span class="text">{{ text }}</span>
  </button>
</template>

<script>
export default {
  props: {
    theme: {
      type: String,
      default: "blue",
    },
    round: {
      type: Boolean,
      default: true,
    },
    icon: {
      type: String,
    },
    text: {
      type: String,
    },
    size: { type: String, default: "md" },
  },
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
button {
  display: inline-flex;
  align-items: center;
  font-size: 1rem;
  .icon {
    font-size: 1.25rem;
  }
  &:hover {
    background-color: #105bbc;
    color: white;
  }
  &.sm {
    font-size: 0.9rem;
    .icon {
      font-size: 1.15rem;
    }
  }
  .text {
    padding: 0;
  }
}
</style>
