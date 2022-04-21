<template>
  <div class="eojeol-list">
    <div class="ej" v-for="ej in eojeols" :key="ej.order">
      <Symbol
        :ej="ej"
        :pumsaType="quizContext.pumsaType"
        :showAnswer="quizContext.isReadingMode()"
        @typed="validateAnswer"
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
import { computed, ref, watch } from "vue";
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
    const createEojeolWrapper = (ej, i) => {
      if (!props.quizContext.rememberAnswer) {
        ej.solved = false;
      }
      return new Ej(ej, i);
    };

    const eojeols = ref(question.value.data.eojeols.map(createEojeolWrapper));
    const moveToNextEojeol = (ej) => {
      const nextEj = eojeols.value.find((elem) => elem.index === ej.index + 1);
      ej.active = false;
      if (nextEj) {
        nextEj.active = true;
      }
    };
    const validateAnswer = (e) => {
      const { ej, value, elapsedTime } = e;
      if (ej.tryAnswer(value, elapsedTime)) {
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
    watch(
      () => question.value,
      () => {
        eojeols.value = question.value.data.eojeols.map(createEojeolWrapper);
      }
    );
    // console.log(question);
    return { validateAnswer, eojeols };
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
  .ej {
    position: relative;
  }
}
</style>
