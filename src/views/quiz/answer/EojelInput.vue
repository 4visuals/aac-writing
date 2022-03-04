<template>
  <div class="eojeol-list">
    <div class="ej" v-for="ej in eojeols" :key="ej.order">
      <Symbol :ej="ej" @typed="validateAnswer" />
    </div>
  </div>
</template>

<script>
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
    this.solved = false;
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
  addTrial(value) {
    this.data.trials.push({ value, time: new Date() });
  }
  markAsSolved() {
    this.data.solved = true;
  }
  tryAnswer(value) {
    this.addTrial(value);
    if (this.data.text === value) {
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
    const question = computed(() => store.getters["quiz/currentQuestion"]);
    const createEojeolWrapper = (ej, i) => {
      if (!props.quizContext.rememberAnswer) {
        ej.solved = false;
      }
      return new Ej(ej, i);
    };
    const eojeols = ref(question.value.data.eojeols.map(createEojeolWrapper));
    const validateAnswer = (e) => {
      const { ej, value } = e;
      if (ej.tryAnswer(value)) {
        const nextEj = eojeols.value.find(
          (elem) => elem.index === ej.index + 1
        );
        ej.active = false;
        if (nextEj) {
          nextEj.active = true;
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
