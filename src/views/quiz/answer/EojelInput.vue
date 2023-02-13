<template>
  <div class="eojeol-list">
    <input
      type="search"
      class="dummy"
      ref="dummy"
      tabindex="-1"
      autocomplete="off"
      enterkeyhint="next"
    />
    <div class="ej" v-for="ej in eojeols" :key="ej.order">
      <Symbol
        :ej="ej"
        :pumsaType="quizContext.pumsaType"
        :showAnswer="false"
        :spaceCommit="true"
        @typed="validateAnswer"
        @clicked="(e) => holdAndSpeak(ej, e)"
      />
    </div>
  </div>
</template>

<script>
import { tts } from "@/components/tts";
import Symbol from "./Symbol.vue";
import quizStore from "@/views/quiz/quizStore";
/**
 * 어절을 렌더링함 사용자는 어절에 정답을 입력함
 *
 */
import { computed, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";

class Hint {
  constructor() {
    this.cnt = 0;
    this.visible = false;
    this.text = "";
  }
  addFailure(text) {
    this.cnt++;
    this.text = text;
    if (this.cnt > 1) {
      this.visible = true;
    }
  }
  reset() {
    this.cnt = 0;
    this.visible = false;
    this.text = "";
  }
}

class Ej {
  constructor(ej, index) {
    this.data = ej;
    this.index = index;
    this.solved = ej.solved;
    this.active = false;
    this.hint = new Hint();
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
  get trials() {
    return this.data.trials;
  }
  setActive(active) {
    this.active = active;
    this.hint.reset();
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
    const sceneClick = computed(() => store.state.quiz.sceneClick);
    const learngingMode = props.quizContext.isLearningMode();
    const dictationMode = props.quizContext.isReadingMode();
    const dummy = ref(null);
    const createEojeolWrapper = (ej, i) => {
      if (!props.quizContext.rememberAnswer) {
        ej.solved = false;
      }
      return new Ej(ej, i);
    };

    const eojeols = ref(question.value.data.eojeols.map(createEojeolWrapper));

    const showReward = (name) => {
      store.commit("ui/showReward", {
        name: `sen_${name}`,
        field: dummy,
        onClose: (passed) => {
          if (passed) {
            quizStore.moveNext();
          }
        },
      });
      new Audio(require(`@/assets/reward/${name}.mp3`)).play();
    };
    const findUnsolvedEojeol = () => {
      const ej = eojeols.value.find((ej) => !ej.solved);
      return ej;
    };
    const moveToNextEojeol = (ej, offset = 1) => {
      const nextEj = ej
        ? eojeols.value.find((elem) => elem.index === ej.index + offset)
        : findUnsolvedEojeol();
      if (!ej && !nextEj) {
        // 보고쓰기, 학습에서
        // 1) 사용자가 버튼을 눌러서 이전, 다음 문제로 이동함
        // 2) 모두 맞춘 경우
        return;
      }
      if (ej) {
        ej.setActive(false);
      }
      if (nextEj) {
        nextEj.setActive(true);
      } else {
        // 다음 문제로 이동
        showReward("passed");
      }
      store.commit("quiz/hideHint");
    };
    const validateAnswer = (e) => {
      const { ej, value, elapsedTime } = e;
      if (ej.tryAnswer(value, elapsedTime)) {
        dummy.value.focus();
        if (learngingMode) {
          tts.speak(ej.text).then(() => {
            moveToNextEojeol(ej);
          });
        } else {
          moveToNextEojeol(ej);
        }
        store.commit("quiz/hideHint");
      } else {
        e.failed();
        if (!dictationMode) {
          ej.hint.addFailure(ej.text);
        }
      }
    };
    let pendingSpeakId = null;
    const speackAndMoveFocus = (delay) => {
      if (pendingSpeakId) {
        clearTimeout(pendingSpeakId);
      }
      dummy.value.focus();
      pendingSpeakId = setTimeout(() => {
        tts
          .speak(question.value.text, { clearPending: true })
          .then(() => moveToNextEojeol(null));
      }, delay);
    };
    const holdAndSpeak = (ej, e) => {
      tts.speak(ej.text);
      store.commit("quiz/hideHint");
      if (e.holdKeyboard) {
        dummy.value.focus();
      }
    };
    watch(
      () => question.value,
      () => {
        eojeols.value = question.value.data.eojeols.map(createEojeolWrapper);
        speackAndMoveFocus(500);
        store.commit("quiz/hideHint");
      }
    );
    watch(
      () => sceneClick.value,
      () => {
        speackAndMoveFocus(0);
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
