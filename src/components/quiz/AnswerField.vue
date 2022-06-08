<template>
  <div class="desc" :class="{ shaking: failed }">
    <div class="text" @click="$emit('textClick', hiddenText)">
      {{ hiddenText }}
    </div>
    <input
      type="text"
      v-if="inputVisible"
      @focus="resetTime"
      @input="handleInput"
      @keyup.enter.stop.prevent="handleEnter"
      @keydown.tab.stop.prevent="handleTab"
      @click="clicked"
      ref="inputEl"
      tabindex="-1"
      :value="inputText"
    />
  </div>
</template>

<script>
import { tts } from "@/components/tts";
import { ref } from "@vue/reactivity";
import { nextTick } from "@vue/runtime-core";
export default {
  props: [
    "inputVisible",
    "hiddenText",
    "inputText",
    "textClick",
    "spaceCommit",
  ],
  emits: ["commit", "update:inputText", "reset"],
  setup(props, { emit }) {
    let startTime = [];
    const inputEl = ref(null);
    let flushed = false;
    let failed = ref(false);
    const focus = () => {
      inputEl.value.focus();
      inputEl.value.select();
    };
    /**
     * 틀렸을때 호출됨
     */
    const retry = () => {
      const falseInput = inputEl.value.value.trim();
      failed.value = true;

      setTimeout(() => {
        // failed.value = false;
        nextTick().then(() => {
          inputEl.value.value = falseInput;
          focus();
          resetTime();
        });
        // focus();
      }, 200);
    };
    const flush = (e) => {
      const elapsedTime = new Date().getTime() - startTime[0];
      console.log("[flush] elapsed", elapsedTime);

      flushed = true;
      emit("commit", {
        e,
        value: e.target.value.trim(),
        elapsedTime,
        done: resetTime,
        failed: retry,
      });
    };
    const handleEnter = (e) => {
      console.log("[enter]", e);
      e.stopImmediatePropagation();
      flush(e);
    };
    const handleTab = (e) => {
      console.log("[tab]", e);
      flush(e);
    };
    const handleInput = (e) => {
      markTime();
      if (e.isComposing) {
        console.log("[FLUSH] SKIP, COMPOSING...");
        return;
      }
      if (props.spaceCommit && e.data && e.data === " ") {
        console.log("[input]", e.target.value);
        flush(e);
      }
    };
    const resetTime = () => {
      startTime = [];
      console.log("[RESET]");
      flushed = false;
      emit("update:inputText", "");
    };
    const clicked = () => {
      tts.speak(props.hiddenText);
      resetTime();
    };
    const markTime = () => {
      failed.value = false;
      startTime.push(new Date().getTime());
    };
    const handleBlur = (e) => {
      if (flushed) {
        console.log("[blur] stop, flushed", e);
        return;
      }
      console.log("[blur]", e);
      if (e.target.value === "") {
        // 아무것도 입력 안함
        return;
      }
      flush(e);
    };
    return {
      inputEl,
      handleEnter,
      focus,
      resetTime,
      markTime,
      handleBlur,
      clicked,
      handleInput,
      handleTab,
      failed,
    };
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
  .shaking {
    animation: shaking 0.3s cubic-bezier(0, 0, 0.2, 1) 1;

    input {
      background-color: orange;
      outline-color: orangered;
    }
  }
}
@keyframes shaking {
  0% {
    transform: translateX(-10px);
  }
  40% {
    transform: translateX(10px);
  }
  80% {
    transform: translateX(-5px);
  }
  90% {
    transform: translateX(5px);
  }
  100% {
    transform: translateX(0px);
  }
}
</style>
