<template>
  <div class="eojeol-list">
    <input type="text" class="dummy" ref="dummy" />
    <div class="ej" v-for="ej in eojeols" :key="ej.order">
      <Symbol
        :ej="ej"
        :pumsaType="quizContext.pumsaType"
        :showAnswer="quizContext.isReadingMode()"
        @typed="validateAnswer"
        @clicked="() => holdAndSpeak(ej)"
      />
    </div>
  </div>
</template>

<script>
import { tts } from "@/components/tts";
import Symbol from "./Symbol.vue";
/**
 * 어절을 렌더링함 사용자는 어절에 정답을 입력함
 *
 */
import { computed, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
// import { useStore } from "vuex";

class Ej {
  constructor(ej, index) {
    this.data = ej;
    this.index = index;
    this.solved = ej.solved;
    this.active = false;
  }
  get order() {
    return this.data.order;
  }
  get picturePath() {
    return this.data.picturePath;
  }
  get pumsa() {
    return this.data.pumsa;
  }
  get text() {
    return this.data.text;
  }
  get isSolved() {
    return this.data.solved;
  }
  addTrial(value, elapsedTimeMillis, correct) {
    this.data.trials.push({
      eojeolRef: this.data.eojeolRef,
      correct,
      value,
      elapsedTimeMillis,
    });
  }
  markAsSolved() {
    this.data.solved = true;
    this.solved = true;
  }
  tryAnswer(value, elapsedTime) {
    const correct = this.data.text === value;
    this.addTrial(value, elapsedTime, correct);
    if (correct) {
      this.markAsSolved();
    }
    return this.isSolved;
  }
}
export default {
  components: {
    Symbol,
  },
  props: ["quizContext"],
  setup(props) {
    const store = useStore();
    const question = computed(() => store.getters["quiz/currentPara"]);
    const dummy = ref(null);
    const createEojeolWrapper = (ej, i) => {
      if (!props.quizContext.rememberAnswer) {
        ej.solved = false;
      }
      return new Ej(ej, i);
    };

    const eojeols = ref(question.value.data.eojeols.map(createEojeolWrapper));
    const moveToNextEojeol = (ej, offset = 1) => {
      const nextEj = ej
        ? eojeols.value.find((elem) => elem.index === ej.index + offset)
        : eojeols.value[0];
      if (ej) {
        ej.active = false;
      }
      if (nextEj) {
        nextEj.active = true;
      }
    };
    const validateAnswer = (e) => {
      const { ej, value, elapsedTime } = e;
      if (ej.tryAnswer(value, elapsedTime)) {
        dummy.value.focus();
        if (props.quizContext.isLearningMode()) {
          tts.speak(ej.text).then(() => {
            moveToNextEojeol(ej);
          });
        } else {
          moveToNextEojeol(ej);
        }
      }
      console.log(ej.isSolved);
    };
    const speackAndMoveFocus = () => {
      dummy.value.focus();
      tts.speak(question.value.text).then(() => moveToNextEojeol(null));
    };
    const holdAndSpeak = (ej) => {
      dummy.value.focus();
      tts.speak(ej.text);
    };
    watch(
      () => question.value,
      () => {
        eojeols.value = question.value.data.eojeols.map(createEojeolWrapper);
        speackAndMoveFocus();
      }
    );
    onMounted(() => {
      setTimeout(speackAndMoveFocus, 500);
    });
    return { dummy, validateAnswer, eojeols, holdAndSpeak };
  },
};
</script>

<style lang="scss" scoped>
.eojeol-list {
  display: flex;
  justify-content: flex-start;
  column-gap: 6px;
  overflow-x: auto;
  padding: 16px;
  position: relative;
  input.dummy {
    position: absolute;
    top: -1px;
    left: -1px;
    width: 0;
    height: 0;
    opacity: 0;
  }
  .ej {
    position: relative;
  }
}
</style>
