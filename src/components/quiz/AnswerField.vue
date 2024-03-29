<template>
  <div class="desc" :class="[theme.name, failed && 'shaking']">
    <div
      class="text"
      :class="{ hidden: inputVisible }"
      @click="$emit('textClick', hiddenText)"
    >
      {{ hiddenText }}
    </div>
    <input
      type="search"
      v-if="inputVisible && flashing"
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
    />
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import { watch, nextTick, computed } from "vue";
import { logger } from "@/service/util";
import { useStore } from "vuex";
export default {
  props: [
    "inputVisible",
    "hiddenText",
    "inputText",
    "textClick",
    "spaceCommit",
    "enableFlash",
  ],
  emits: ["commit", "update:inputText", "reset", "clicked"],
  setup(props, { emit }) {
    const store = useStore();
    const theme = computed(() => store.state.ui.theme);
    let startTime = [];
    const inputEl = ref(null);
    const flashing = ref(true);
    let cachedInput = "";
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
      // const falseInput = inputEl.value.value.trim();

      setTimeout(() => {
        /*
         * markTime()에서 failed 를 false 로 초기화함
         */
        failed.value = true;
        setTimeout(() => {
          // inputEl.value.value = falseInput;
          focus();
          resetTime();
        }, 200);
        // focus();
      }, 0);
      // setTimeout(() => (failed.value = false), 1000);
    };
    const doFlash = () => {
      flashing.value = false;
      cachedInput = inputEl.value.value;
      nextTick()
        .then(() => {
          flashing.value = true;
        })
        .then(() => {
          console.log("[flash on]", cachedInput);
          if (inputEl.value) {
            // 오답인 경우에만 다시 복원
            inputEl.value.value = cachedInput;
          }
        });
    };
    const flush = (e) => {
      const elapsedTime = new Date().getTime() - startTime[0];
      const value = e.target.value.trim();
      if (value.length === 0) {
        // e.target.value = "";
        return;
      }
      console.log("[flush] elapsed", elapsedTime);

      flushed = true;
      if (props.enableFlash) {
        doFlash();
      }

      emit("commit", {
        e,
        value,
        elapsedTime,
        done: resetTime,
        failed: retry,
      });
    };
    const handleEnter = (e) => {
      logger.log("[enter]", e.isComposing, e);
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
    const resetTime = (option = { clearInput: false }) => {
      startTime = [];
      console.log("[RESET]");
      flushed = false;
      if (option.clearInput) {
        inputEl.value.value = "";
      }
      // emit("update:inputText", "");
      // iOS: input에 포커스 놓이면 가운데로 스크롤함.
      //    : 강제로 스크롤 땡겨줌
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 500);
    };
    const clicked = (e) => {
      // tts.speak(props.hiddenText);
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
    watch(
      () => props.inputText,
      () => {
        console.log("[REST INPUT]");
        if (inputEl.value) {
          inputEl.value.value = "";
        }
      }
    );
    return {
      theme,
      inputEl,
      handleEnter,
      focus,
      flashing,
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
@import "~@/assets/resizer";
.desc {
  font-size: 24px;
  position: relative;
  text-align: center;
  display: flex;
  flex-direction: column;
  &.blue {
    input {
      border: 1px solid #4b7bec;
      color: #4b7bec;
      font-weight: 600;
      &:focus {
        background-color: #d2ecfd;
      }
    }
    &.shaking {
      input {
        background-color: #fff5c7;
        border-color: #fff5c7;
      }
    }
  }
  &.brown {
    input {
      border: 1px solid #865900;
      color: #958f77;
      font-weight: 600;
      &:focus {
        background-color: #fffbd5;
      }
    }
    &.shaking {
      input {
        background-color: #fff5c7;
        border-color: #fff5c7;
      }
    }
  }
  .text {
    padding: 8px 20px;
    border: 2px solid transparent;
    background-color: #f7f7f7;
    color: #4d4d4d;
    white-space: nowrap;
    display: flex;
    flex: 1 1 auto;
    align-items: center;
    border-radius: 1rem;
    &.hidden {
      padding: 8px 20px;
      @include mobile {
        padding: 8px 20px;
      }
    }
  }
  input {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    color: black;
    position: absolute;
    padding: 8px 16px;
    border-color: transparent;
    background-color: #fff;
    outline: none;
    // outline-color: #78ba73;
    border-radius: 1rem;
    text-align: center;
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
