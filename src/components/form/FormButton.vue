<template>
  <button class="nude" :class="{ round, blue: theme === 'blue' }">
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
  .icon {
    font-size: 18px;
  }
  &:hover {
    background-color: #105bbc;
    color: white;
  }
  &.sm {
    font-size: 12px;
    .icon {
      font-size: 18px;
    }
  }
  .text {
    padding: 0;
  }
}
</style>
