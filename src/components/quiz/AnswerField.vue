<template>
  <div class="desc" :class="{ shaking: failed }">
    <div class="text" @click="$emit('textClick', hiddenText)">
      {{ hiddenText }}
    </div>
    <input
      type="search"
      v-if="inputVisible"
      tabindex="-1"
      spellcheck="false"
      enterkeyhint="done"
      autocomplete="off"
      @focus="resetTime"
      @input="handleInput"
      @keydown.enter="handleEnter"
      @keydown.tab.stop.prevent="handleTab"
      @click="clicked"
      ref="inputEl"
      :value="inputText"
    />
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
export default {
  props: [
    "inputVisible",
    "hiddenText",
    "inputText",
    "textClick",
    "spaceCommit",
  ],
  emits: ["commit", "update:inputText", "reset", "clicked"],
  setup(props, { emit }) {
    let startTime = [];
    const inputEl = ref(null);
    let flushed = false;
    let failed = ref(false);
    const focus = () => {
      if (inputEl.value) {
        // 일부만 풀고 넘겼을때 null 일 수 있음.
        // inputEl.value.select();
        inputEl.value.focus();
      }
    };
    /**
     * 틀렸을때 호출됨
     */
    const retry = () => {
      const falseInput = inputEl.value.value.trim();

      setTimeout(() => {
        /*
         * markTime()에서 failed 를 false 로 초기화함
         */
        failed.value = true;
        setTimeout(() => {
          inputEl.value.value = falseInput;
          focus();
          resetTime();
        }, 200);
        // focus();
      }, 0);
      // setTimeout(() => (failed.value = false), 1000);
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
      console.log("[enter]", e.isComposing, e);
      // CHROME: 한글 입력상태에서(composition)엔터를 누르면 이벤트가 두 번 발생함
      //       : 첫번째는 e.isComposing이 true이고
      //       : 뒤에 이어지는 이번트에서는 false
      // if (e.isComposing) {
      //   return;
      // }
      e.stopImmediatePropagation();
      flush(e);
    };
    const handleTab = (e) => {
      console.log("[tab]", e);
      flush(e);
    };
    const handleInput = (e) => {
      markTime();
      // console.log("[INPUT]", e);
      // emit("update:inputText", e.target.value);
      if (e.isComposing) {
        console.log("[COMPOSING]");
        if (props.spaceCommit && e.data && e.data.includes(" ")) {
          // Mac chrome에서 스페이스를 누르면 e.isComposing 상태가 해제되지 않는다.
          // TODO window chrome에서도 확인해봐야 함
          console.log("[SPACE COMMIT]");
          flush(e);
        }
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
      // iOS: input에 포커스 놓이면 가운데로 스크롤함.
      //    : 강제로 스크롤 땡겨줌
      setTimeout(() => {
        console.log("[SCROLL TOP]");
        window.scrollTo(0, 0);
      }, 500);
    };
    const clicked = (e) => {
      // tts.speak(props.hiddenText);
      console.log("[ANSWERFILED] CLICKED");
      e.stopImmediatePropagation();
      // resetTime();
      emit("clicked");
      focus();
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
