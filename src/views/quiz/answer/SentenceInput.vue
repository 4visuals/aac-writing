<template>
  <div class="text-input">
    <input type="text" class="dummy" ref="dummy" />
    <AnswerField
      ref="field"
      v-model:inputText="trial"
      :hiddenText="question.text"
      :inputVisible="!correct"
      :spaceCommit="quizContext.isWord()"
      @commit="checkAnswer"
      @rest="() => (inputText = '')"
    />
    <button class="btn-submit" @click="checkByClick" v-if="!question.isSolved">
      <SpanText>제출</SpanText>
    </button>
  </div>
</template>

<script>
import { tts } from "@/components/tts";
import { SpanText } from "@/components/text";
import AnswerField from "@/components/quiz/AnswerField.vue";
import { computed, onMounted, ref, watch } from "@vue/runtime-core";
import { useStore } from "vuex";
import quizStore from "../quizStore";

class SentenceQuestion {
  constructor(para) {
    this.para = para;
    // this.trials = storage.session.read(`para-${para.seq}`, []);
  }
  get text() {
    return this.para.text;
  }
  get isSolved() {
    return this.para.solved;
  }
  tryAnswer(trial, elapsedTime) {
    return this.para.addTrial(trial, elapsedTime);
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
    const store = useStore();
    const field = ref(null);
    const dummy = ref(null);
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

    const showReward = (name) => {
      store.commit("ui/showReward", {
        name,
        field: dummy,
        onClose: (passed) => {
          if (passed) {
            quizStore.moveNext();
          } else {
            field.value.focus();
          }
        },
      });
      new Audio(require(`@/assets/reward/${name}.mp3`)).play();
    };
    let pendingSpeakId = null;
    const speackAndFocus = (delay) => {
      if (pendingSpeakId) {
        clearTimeout(pendingSpeakId);
      }
      dummy.value.focus();
      pendingSpeakId = setTimeout(() => {
        tts
          .speak(question.value.text, { clearPending: true })
          .then(() => field.value.focus())
          .catch((e) => {
            console.log("[stop tts]", e);
          });
      }, delay);
    };
    const checkAnswer = (e) => {
      const { elapsedTime } = e;
      const learngingMode = props.quizContext.isLearningMode();
      const passed = question.value.tryAnswer(trial.value.trim(), elapsedTime);
      correct.value = learngingMode ? passed : false;
      dummy.value.focus();
      if (learngingMode) {
        if (passed) {
          tts.speak(trial.value.trim()).then(() => {
            showReward("passed");
          });
        } else {
          showReward("failed");
        }
      } else {
        // 퀴즈모드에서는 정답 상관없이 바로 다음 문제로 넘어감
        e.done();
        quizStore.moveNext();
      }
    };
    const checkByClick = () => {
      const e = {
        value: trial.value,
        done: () => {},
      };
      checkAnswer(e);
    };
    watch(
      () => source.value,
      () => {
        trial.value = "";
        correct.value = source.value && source.value.solved;
        question.value = new SentenceQuestion(source.value);
        dummy.value.focus();
        speackAndFocus(500);
      }
    );
    onMounted(() => {
      speackAndFocus(500);
      //speackAndFocus();
    });
    return {
      field,
      dummy,
      trial,
      correct,
      question,
      checkAnswer,
      checkByClick,
    };
  },
};
</script>

<style lang="scss" scoped>
.text-input {
  display: flex;
  column-gap: 1rem;
  padding-bottom: 2rem;
  position: relative;
  input.dummy {
    position: absolute;
    top: -1px;
    left: -1px;
    width: 0;
    height: 0;
    opacity: 0;
  }
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
