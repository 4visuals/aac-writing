<template>
  <div class="container layout-h-child w-1190px">
    <div v-if="ctx" class="quiz-wrapper">
      <LevelNavBar
        v-if="ctx.isLevelQuiz()"
        :section="ctx.config.section"
        @back="closeQuiz"
      />
      <BookNavBar
        v-else-if="ctx.isBookQuiz()"
        :section="ctx.config.section"
        @back="closeQuiz"
      />
      <input
        type="search"
        tabindex="-1"
        ref="focusing"
        autocomplete="off"
        enterkeyhint="done"
        @keyup="hideReward"
      />
      <template v-if="ctx">
        <Numbering @speak="speak" :theme="theme" />
        <div
          class="answer-view"
          :class="{ blue: ctx.isLevelQuiz(), brown: ctx.isBookQuiz() }"
          v-if="ctx.isReadingMode()"
          @click="speak"
        >
          <h3>{{ ctx.currentQuestion.text }}</h3>
        </div>
        <HintView v-if="hint && hint.visible" :hint="hint" />
        <div class="answer">
          <component
            :is="ctx.options.answerComponent"
            :quizContext="ctx"
            :question="ctx.currentQuestion"
            :fillHeight="false"
            @quizEnd="alertForResult"
          />
        </div>
        <div class="question">
          <component
            :is="ctx.options.questionComponent"
            :quizContext="ctx"
            :fillHeight="true"
            @speaking="sceneClicked"
          />
          <ActionIcon
            v-if="!ctx.isQuizMode() && ctx.currentQuestion.hasPrevQuiz()"
            class="icon left"
            icon="chevron_left"
            @click.stop.prevent="moveQuiz(-1)"
          />
          <template v-if="!ctx.isQuizMode()">
            <ActionIcon
              class="icon right"
              icon="chevron_right"
              @click.stop.prevent="moveQuiz(1)"
            />
          </template>
        </div>
      </template>
      <div class="none" v-else>NONE</div>
      <RewardView v-if="reward" />
      <transition name="pop">
        <TtsView v-if="speaking" />
      </transition>
      <QuizResult v-if="quizFinished" />
    </div>
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted, ref } from "@vue/runtime-core";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import quizStore from "./quizStore";
import quiz from "@/views/quiz";
import { useStore } from "vuex";
import ActionIcon from "@/components/form/ActionIcon.vue";
import Numbering from "@/views/quiz/Numbering.vue";
import HintView from "./HintView.vue";
import RewardView from "./RewardView.vue";
import TtsView from "./TtsView.vue";
import QuizResult from "./result/QuizResult.vue";
import { tts } from "@/components/tts";
import LevelNavBar from "../level/LevelNavBar.vue";
import BookNavBar from "../book/BookNavBar.vue";
export default {
  components: {
    ActionIcon,
    Numbering,
    HintView,
    RewardView,
    TtsView,
    QuizResult,
    LevelNavBar,
    BookNavBar,
  },
  setup() {
    const store = useStore();
    const ctx = computed(() => store.state.quiz.quizContext);
    const hint = computed(() => store.state.quiz.hint);
    const reward = computed(() => store.getters["ui/reward"]);
    const speaking = computed(() => store.state.tts.speaking);
    const theme = computed(() => store.state.ui.theme);
    const focusing = ref(null);
    const keyConsumer = ref(null);
    const quizFinished = computed(() => store.state.quiz.finished);
    const router = useRouter();
    store.commit("ui/hideMenu");
    store.commit("quiz/hideHint");
    quiz.loadQuiz();
    /**
     * 모바일에서 soft keyboard가 내려갔다 올라가는 불편을 방지하기 위해서
     * dummy로 집어넣은 inpupt[type=text]에 포커스를 옮겨둠.
     */
    const holdSoftKeyboard = () => focusing.value.focus();

    const moveQuiz = (dir) => {
      // if (!ctx.value.isReadingMode()) {
      //   holdSoftKeyboard();
      // }
      if (dir > 0) {
        quizStore.moveNext();
      } else {
        quizStore.movePrev();
      }
      // holdSoftKeyboard();
    };
    const alertForResult = () => {
      moveQuiz(1);
    };
    const speak = () => {
      return tts.speak(ctx.value.currentQuestion.text);
    };
    const sceneClicked = () => {
      // if (!ctx.value.isReadingMode()) {
      //   }
      holdSoftKeyboard();
    };
    const closeQuiz = (dir) => {
      if (dir === "back") {
        router.replace(ctx.value.prevPage.close);
      } else if (dir === "close") {
        router.replace({ name: ctx.value.prevPage.back });
      } else {
        throw new Error("invalid router path: ", dir);
      }
    };
    onBeforeRouteLeave(() => {
      store.commit("quiz/closeQuiz");
      return true;
    });
    onMounted(() => {
      store.commit("ui/hideReward");
      store.commit("ui/setBackgroundVisible", false);
      store.commit("ui/setNavSize", { expanded: false, topPadding: 56 });
    });
    onUnmounted(() => {
      store.commit("ui/setBackgroundVisible", true);
      store.commit("ui/setNavSize", { expanded: true, topPadding: 120 });
    });
    return {
      ctx,
      theme,
      hint,
      reward,
      focusing,
      keyConsumer,
      quizFinished,
      speaking,
      moveQuiz,
      alertForResult,
      sceneClicked,
      holdSoftKeyboard,
      speak,
      closeQuiz,
    };
  },
};
</script>

<style lang="scss" scoped>
.quiz-wrapper {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  position: relative;
  border-radius: 2vmin;
  overflow: hidden;
  background-color: white;
  row-gap: 8px;
  > input[type="search"] {
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
  .answer-view {
    display: flex;
    justify-content: center;
    &.blue {
      h3 {
        color: #007bff;
      }
    }
    &.brown {
      h3 {
        color: #865900;
      }
    }
    h3 {
      text-align: center;
      padding: 8px 16px;
      margin: 8px 0;
      cursor: pointer;
      background-color: white;
      border-radius: 3rem;
      box-shadow: 1px 1px 4px #0000004d;
      font-size: 18px;
      font-weight: 600;
      line-height: 1.2;
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
