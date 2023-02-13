<template>
  <div class="symbol" :class="{ locked: !ej.solved && !ej.active }">
    <HintView
      v-if="ej.hint.visible"
      :hint="ej.hint"
      @hint-click="symbolClicked"
    />
    <div
      v-else
      class="pic-holder"
      :style="{ 'background-image': `url('${pumsaImg()}')` }"
      @click.stop="symbolClicked"
    ></div>
    <div class="desc">
      <AnswerField
        ref="inputEl"
        v-model:inputText="trial"
        :hiddenText="ej.text"
        :inputVisible="!correct"
        @commit="checkAnswer"
        @textClick="speak"
        :spaceCommit="true"
      />
    </div>
    <div class="lock" v-if="!ej.solved && !ej.active"></div>
  </div>
</template>

<script>
import AnswerField from "@/components/quiz/AnswerField.vue";
import { tts } from "@/components/tts";
import { key, path } from "@/service/util";
import { ref, watch } from "@vue/runtime-core";
import HintView from "../HintView.vue";
export default {
  components: {
    AnswerField,
    HintView,
  },
  props: ["ej", "pumsaType", "showAnswer"],
  setup(props, { emit }) {
    /**
     * 입력한 텍스트
     */
    const trial = ref("");
    const correct = ref(false);
    if (props.showAnswer) {
      // 문장 읽기 모드 - 입력 필드가 필요없다.
      correct.value = true;
    }
    const pumsaImg = () => {
      const { ej } = props;
      if (ej.isSolved || props.showAnswer) {
        return path.resolveUrl(props.ej.picturePath);
      } else {
        const { pumsaType } = props;
        let pumsa = "";
        let ext = ".png";
        if (ej.hint.cnt === 1) {
          pumsa = "not-good";
          ext = ".svg";
        } else if (pumsaType === "follow") {
          pumsa = ej.pumsa.startsWith("hada") ? "hada" : ej.pumsa;
        } else {
          pumsa = pumsaType;
        }
        return require(`@/assets/s-${pumsa}${ext}`);
      }
    };
    const inputEl = ref(null);
    watch(
      () => props.ej,
      (ej) => {
        correct.value = ej.solved;
        if (props.showAnswer) {
          correct.value = true;
        }
        trial.value = "" + Math.random();
      },
      { immediate: true }
    );
    watch(
      () => props.ej.active,
      (active) => {
        if (active) {
          inputEl.value.focus();
        }
      }
    );
    watch(
      () => props.ej.solved,
      (solved) => (correct.value = solved)
    );
    const checkAnswer = (e) => {
      const { elapsedTime } = e;
      emit("typed", {
        ej: props.ej,
        value: e.value,
        elapsedTime,
        failed: e.failed,
      });
    };
    const flush = (e) => {
      if (key.isComposing(e)) {
        return;
      } else {
        emit("typed", { ej: props.ej, value: e.target.value });
      }
    };
    const symbolClicked = () => {
      emit("clicked", { holdKeyboard: true });
      setTimeout(() => {
        inputEl.value.focus();
      }, 300);
    };
    const speak = () => {
      tts.speak(props.ej.text);
    };
    return {
      trial,
      correct,
      pumsaImg,
      flush,
      inputEl,
      speak,
      checkAnswer,
      symbolClicked,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
.symbol {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  &.locked {
    filter: grayscale(1);
    opacity: 0.6;
    pointer-events: none;
  }
  .pic-holder {
    width: 72px;
    height: 72px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
  .desc {
    font-size: 2.5rem;
    position: relative;
    text-align: center;
    .text {
      padding: 3px;
      border: 2px solid transparent;
      background-color: #d2d2d2;
      white-space: nowrap;
    }
    input {
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%; // 없으면 firefox에서 깨짐
      color: black;
      position: absolute;
      padding: 3px;
    }
  }
  .lock {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
  }
}
@include mobile {
  .symbol {
    .pic-holder {
      width: 56px;
      height: 56px;
    }
  }
}
</style>
