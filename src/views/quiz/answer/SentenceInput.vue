<template>
  <div class="text-input">
    <input type="search" autocomplete="off" class="dummy" ref="dummy" />
    <AnswerField
      ref="field"
      v-model:inputText="trial"
      :hiddenText="question.text"
      :inputVisible="!correct"
      :spaceCommit="quizContext.isWord()"
      :enableFlash="false"
      @commit="checkAnswer"
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
    // 퀴즈를 종료할때 this.para가 null인 상태가 잠깐 존재함
    return this.para ? this.para.text : "";
  }
  get isSolved() {
    return this.para.solved;
  }
  get trials() {
    return this.para.trials;
  }
  isWordType() {
    return this.para.config.options.quizResource === "W";
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
    const sceneClick = computed(() => store.state.quiz.sceneClick);
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
      const type = question.value.isWordType() ? "word_" : "sen_";
      store.commit("ui/showReward", {
        name: type + name,
        field: dummy,
        onClose: (passed) => {
          if (!question.value.para) {
            return;
          }
          field.value.focus();
          if (passed) {
            if (question.value.para.hasNextQuiz()) {
              quizStore.moveNext();
            } else {
              emit("quizEnd");
            }
          }
        },
      });
      dummy.value.focus();
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
          .then(() => field.value && field.value.focus()) // 퀴즈를 새로 이동할때 field가 없어짐
          .catch((e) => {
            console.log("[stop tts]", e);
          });
      }, delay);
    };
    const checkAnswer = (e) => {
      console.log("[ANSWER]", e.value.trim());
      const { elapsedTime } = e;
      /* 낱말학습 or 문장학습인지 */
      const learngingMode = props.quizContext.isLearningMode();
      /* 보고쓰기 모드인지 */
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
        e.done({ clearInput: true });
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
        trial.value = "" + Math.random();
        correct.value = source.value && source.value.solved;
        question.value = new SentenceQuestion(source.value);
        // dummy.value.focus();
        speackAndFocus(500);
      }
    );
    watch(
      () => sceneClick.value,
      () => {
        speackAndFocus(0);
      }
    );
    onMounted(() => {
      // speackAndFocus(500);
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
