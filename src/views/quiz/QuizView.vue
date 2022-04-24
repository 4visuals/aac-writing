<template>
  <div class="quiz-wrapper">
    <input type="text" ref="focusing" />
    <template v-if="ctx">
      <Numbering />
      <div class="question">
        <component
          :is="ctx.options.questionComponent"
          :quizContext="ctx"
          :fillHeight="true"
          @speaking="sceneClicked"
        />
        <ActionIcon
          v-if="ctx.currentQuestion.hasPrevQuiz()"
          class="icon left"
          icon="chevron_left"
          @click.stop.prevent="moveQuiz(-1)"
        />
        <ActionIcon
          v-if="ctx.currentQuestion.hasNextQuiz()"
          class="icon right"
          icon="chevron_right"
          @click.stop.prevent="moveQuiz(1)"
        />
        <ActionIcon
          v-else
          class="icon right"
          icon="last_page"
          @click.stop.prevent="alertForResult"
        />
        <WordDecomposeView
          v-if="wordDecomposing"
          :word="ctx.currentQuestion.text"
          @viewClicked="wordDecomposing = false"
        />
      </div>
      <div class="answer">
        <component
          :is="ctx.options.answerComponent"
          :quizContext="ctx"
          :question="ctx.currentQuestion"
          :fillHeight="false"
        />
      </div>
      <div class="sentence-view" v-if="ctx.isReadingMode()" @click="speak">
        <h3>{{ ctx.currentQuestion.text }}</h3>
      </div>
    </template>
    <div class="none" v-else>NONE</div>
    <RewardView v-if="reward" />
    <transition name="pop">
      <TtsView v-if="speaking" />
    </transition>
    <QuizResult v-if="quizFinished" />
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted, ref } from "@vue/runtime-core";
import { useRoute } from "vue-router";
import quizStore from "./quizStore";
import quiz from "@/views/quiz";
import { useStore } from "vuex";
import ActionIcon from "@/components/form/ActionIcon.vue";
import Numbering from "@/views/quiz/Numbering.vue";
import RewardView from "./RewardView.vue";
import TtsView from "./TtsView.vue";
import WordDecomposeView from "./question/WordDecomposeView.vue";
import QuizResult from "./result/QuizResult.vue";
import { tts } from "@/components/tts";
export default {
  components: {
    ActionIcon,
    Numbering,
    RewardView,
    TtsView,
    WordDecomposeView,
    QuizResult,
  },
  setup() {
    const store = useStore();
    const ctx = computed(() => store.state.quiz.quizContext);
    const reward = computed(() => store.getters["ui/reward"]);
    const speaking = computed(() => store.state.tts.speaking);
    const focusing = ref(null);
    const wordDecomposing = ref(false);
    const quizFinished = computed(() => store.state.quiz.finished);
    const route = useRoute();
    console.log("[QUIZ]", route.params.seq);
    quiz.loadQuiz();

    const holdSoftKeyboard = () => focusing.value.focus();

    const moveQuiz = (dir) => {
      if (!ctx.value.isReadingMode()) {
        holdSoftKeyboard();
      }
      if (dir > 0) {
        quizStore.moveNext();
      } else {
        quizStore.movePrev();
      }
    };
    const alertForResult = () => {
      if (window.confirm("결과 화면으로 이동합니까?")) {
        moveQuiz(1);
      }
    };
    const speak = () => {
      return tts.speak(ctx.value.currentQuestion.text);
    };
    const sceneClicked = () => {
      if (!ctx.value.isReadingMode()) {
        holdSoftKeyboard();
      }
      if (ctx.value.isReadingMode()) {
        wordDecomposing.value = true;
      }
    };
    onMounted(() => {
      store.commit("ui/setBackgroundVisible", false);
      store.commit("ui/setNavSize", { expanded: false, topPadding: 56 });
    });
    onUnmounted(() => {
      store.commit("ui/setBackgroundVisible", true);
      store.commit("ui/setNavSize", { expanded: true, topPadding: 120 });
    });
    return {
      ctx,
      reward,
      focusing,
      wordDecomposing,
      quizFinished,
      speaking,
      moveQuiz,
      alertForResult,
      sceneClicked,
      holdSoftKeyboard,
      speak,
    };
  },
};
</script>

<style lang="scss" scoped>
.quiz-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  > input[type="text"] {
    position: absolute;
    width: 0;
    height: 0;
    padding: 0;
    outline: none;
    border: none;
    background-color: transparent;
    top: -1px;
    left: -1px;
  }
  .question {
    flex: 3 3;
    display: flex;
    flex-direction: column;
    position: relative;
    .icon {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      font-size: 3.5rem;
      z-index: 5;
      background-color: #ffffffcc;
      border-radius: 4rem;
      color: #666;
      box-shadow: rgb(0 0 0 / 25%) 0px 0.0625em 0.0625em,
        rgb(0 0 0 / 25%) 0px 0.125em 0.5em,
        rgb(255 255 255 / 10%) 0px 0px 0px 1px inset;
      &.left {
        left: 20px;
      }
      &.right {
        right: 20px;
      }
    }
  }
  .answer {
    flex: 0 1 auto;
    display: flex;
    // padding: 16px;
    justify-content: center;
    // overflow-x: auto;
  }
  .sentence-view {
    text-align: center;
    padding: 8px 16px;
    margin: 8px;
    color: #007bff;
    cursor: pointer;
    border: 1px solid #007bff;
    h3 {
      font-size: 2.5rem;
      line-height: 1.5;
    }
  }
  .pop-enter-from,
  .pop-leave-to {
    opacity: 0;
  }
  .pop-enter-active,
  .pop-leave-active {
    transition: opacity 0.2s cubic-bezier(0, 0, 0.3, 1.33);
  }
}
</style>
