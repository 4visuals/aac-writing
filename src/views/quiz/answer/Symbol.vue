<template>
  <div class="symbol">
    <div
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
  </div>
</template>

<script>
import AnswerField from "@/components/quiz/AnswerField.vue";
import { tts } from "@/components/tts";
import { key, path } from "@/service/util";
import { ref, watch } from "@vue/runtime-core";
export default {
  components: {
    AnswerField,
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
      if (props.ej.isSolved || props.showAnswer) {
        return path.resolveUrl(props.ej.picturePath);
      } else {
        const { pumsaType } = props;
        let pumsa = "";
        if (pumsaType === "follow") {
          pumsa = props.ej.pumsa.startsWith("hada") ? "hada" : props.ej.pumsa;
        } else {
          pumsa = pumsaType;
        }
        return require(`@/assets/s-${pumsa}.png`);
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
        trial.value = "";
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
.symbol {
  display: flex;
  flex-direction: column;
  align-items: center;
  .pic-holder {
    width: 80px;
    height: 80px;
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
}
</style>
