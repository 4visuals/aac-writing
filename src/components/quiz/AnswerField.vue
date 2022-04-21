<template>
  <div class="desc">
    <div class="text" @click="$emit('textClick', hiddenText)">
      {{ hiddenText }}
    </div>
    <input
      type="text"
      v-if="inputVisible"
      @keydown="markTime"
      @keydown.enter.stop="flush"
      @keydown.tab.stop.prevent="flush"
      @input="$emit('update:inputText', $event.target.value)"
      @click="resetTime"
      ref="inputEl"
      :value="inputText"
    />
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
export default {
  props: ["inputVisible", "hiddenText", "inputText", "textClick"],
  emits: ["commit", "update:inputText", "reset"],
  setup(props, { emit }) {
    let startTime = [];
    const inputEl = ref(null);
    const focus = () => {
      inputEl.value.focus();
      inputEl.value.select();
    };
    const flush = (e) => {
      if (e.isComposing) {
        return;
      }
      const elapsedTime = new Date().getTime() - startTime[0];
      console.log("[ELAPSED]", elapsedTime);

      emit("commit", {
        e,
        value: e.target.value,
        elapsedTime,
        done: resetTime,
      });
    };
    const resetTime = () => {
      startTime = [];
      console.log("[RESET] " + startTime);
      emit("update:inputText", "");
    };
    const markTime = () => {
      startTime.push(new Date().getTime());
    };

    return { inputEl, flush, focus, resetTime, markTime };
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
    width: 100%;
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
