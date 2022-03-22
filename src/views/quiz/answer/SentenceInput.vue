<template>
  <div class="text-input">
    <AnswerField
      v-model:inputText="trial"
      :hiddenText="question.text"
      :inputVisible="!correct"
      @commit="checkAnswer"
    />
    <button class="btn-submit" @click="checkAnswer">
      <SpanText>제출</SpanText>
    </button>
  </div>
</template>

<script>
import storage from "@/service/storage";
import { SpanText } from "@/components/text";
import AnswerField from "@/components/quiz/AnswerField.vue";
import { computed, ref, watch } from "@vue/runtime-core";
import { useStore } from "vuex";

class SentenceQuestion {
  constructor(para) {
    this.para = para;
    this.trials = storage.session.read(`para-${para.seq}`, []);
  }
  get text() {
    return this.para.text;
  }
  tryAnswer(trial) {
    this.para.solved = this.para.text === trial;
    this.trials.push(trial);
  }
}
/**
 * 문장 입력
 */
export default {
  components: {
    SpanText,
    AnswerField,
  },
  props: ["quizContext"],
  setup(props) {
    // const { quizContext } = props;
    const store = useStore();
    const source = computed(() => store.getters["quiz/currentPara"]);
    /**
     * 학생이 입력한 문장
     */
    const trial = ref("");
    /**
     * 현재 질문
     */
    const question = ref(new SentenceQuestion(source.value));
    const correct = ref(false);
    const checkAnswer = () => {
      correct.value = question.value.text === trial.value;
      // question.value.solved = correct.value;
      question.value.tryAnswer(trial.value);
      console.log(props.quizContext);
    };
    watch(
      () => source.value,
      () => {
        trial.value = "";
        correct.value = source.value.solved;
        question.value = new SentenceQuestion(source.value);
      }
    );
    return {
      trial,
      correct,
      question,
      checkAnswer,
    };
  },
};
</script>

<style lang="scss" scoped>
.text-input {
  display: flex;
  column-gap: 1rem;
  padding-bottom: 2rem;
  .btn-submit {
    background-color: #a2ec9c;
    padding: 1rem 2rem;
    border-radius: 1rem;
    border: none;
    &:hover {
      background-color: #8cd488;
    }
    &:active {
      background-color: #67a762;
    }
  }
}
</style>
