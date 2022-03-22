<template>
  <div class="desc">
    <div class="text">{{ hiddenText }}</div>
    <input
      type="text"
      v-if="inputVisible"
      @keydown.enter.stop="flush"
      @keydown.tab.stop.prevent="flush"
      @input="$emit('update:inputText', $event.target.value)"
      ref="inputEl"
      :value="inputText"
    />
  </div>
</template>

<script>
export default {
  props: ["inputVisible", "hiddenText", "inputText"],
  emits: ["commit", "update:inputText"],
  setup(_, { emit }) {
    const flush = (e) => {
      emit("commit", { e, value: e.target.value });
    };

    return { flush };
  },
};
</script>

<style lang="scss" scoped>
.desc {
  font-size: 2.5rem;
  position: relative;
  text-align: center;
  display: flex;
  flex-direction: column;
  .text {
    padding: 1rem 1.5rem;
    border: 2px solid transparent;
    background-color: #d2d2d2;
    white-space: nowrap;
    display: flex;
    flex: 1 1 auto;
    align-items: center;
    border-radius: 1rem;
  }
  input {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    color: black;
    position: absolute;
    padding: 1rem 1.5rem;
    border-color: transparent;
    background-color: #a2ec9c;
    outline-color: #78ba73;
    border-radius: 1rem;
  }
}
</style>
