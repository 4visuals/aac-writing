<template>
  <div class="text-input">
    <input type="search" autocomplete="off" class="dummy" ref="dummy" />
    <AnswerField
      ref="field"
      v-model:inputText="trial"
      :hiddenText="question.text"
      :inputVisible="!correct"
      :spaceCommit="quizContext.isWord()"
      @commit="checkAnswer"
      @clicked="speackAndFocus(0)"
      @rest="() => (inputText = '')"
    />
  </div>
</template>

<script>
import { tts } from "@/components/tts";
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
  get trials() {
    return this.para.trials;
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
    AnswerField,
  },
  props: ["quizContext"],
  setup(props, { emit }) {
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

    const moveToNext = () => {
      store.commit("ui/hideReward");
      if (question.value.para.hasNextQuiz()) {
        quizStore.moveNext();
      } else {
        emit("quizEnd");
      }
    };
    const moveIfPassed = (e) => {
      if (e.target !== dummy.value) {
        console.log(dummy.value);
        return;
      }
      // if (correct.value) {
      //   moveToNext();
      // } else {
      //   }
      store.commit("ui/hideReward");
    };
    const showReward = (name) => {
      store.commit("ui/showReward", {
        name,
        field: dummy,
        onClose: (passed) => {
          if (!question.value.para) {
            return;
          }
          if (passed) {
            if (question.value.para.hasNextQuiz()) {
              quizStore.moveNext();
            } else {
              emit("quizEnd");
            }
          } else {
            field.value.focus();
          }
        },
      });
      // dummy.value.focus();
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
      const dictationMode = props.quizContext.isReadingMode();
      const passed = question.value.tryAnswer(e.value.trim(), elapsedTime);
      correct.value = learngingMode ? passed : false;

      if (learngingMode) {
        if (passed) {
          showReward("passed");
        } else {
          if (!dictationMode) {
            store.commit("quiz/showHint", {
              cnt: question.value.trials.length,
              text: question.value.text,
            });
          }
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
        // dummy.value.focus();
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
      moveToNext,
      speackAndFocus,
      moveIfPassed,
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
