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

      <template v-if="ctx">
        <QuizResult v-if="quizFinished" />
        <template v-else>
          <input
            type="search"
            tabindex="-1"
            ref="focusing"
            autocomplete="off"
            enterkeyhint="done"
            @keyup="hideReward"
          />
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
      </template>
      <div class="none" v-else>NONE</div>
      <RewardView v-if="reward" />
      <transition name="pop">
        <TtsView v-if="speaking" />
      </transition>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted, provide, ref } from "vue";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import quizStore from "./quizStore";
import quiz, { Segment } from "@/views/quiz";
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
    // const keyConsumer = ref(null);
    const quizFinished = computed(() => store.state.quiz.finished);
    const router = useRouter();
    store.commit("ui/hideMenu");
    store.commit("quiz/hideHint");
    store.commit("ui/setNavVisible", false);
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
    /**
     * section 상세 페이지 경로
     */
    const gotoSection = () => {
      router.replace(ctx.value.getSectionPath());
    };
    /**
     * chapter 페이지 경로(단계별, 교과서)
     */
    const closeQuiz = () => {
      router.replace({ name: ctx.value.getMainPath() });
    };
    /**
     * 새로운 퀴즈 시작
     * @param {QuizContext} quizContext - quiz/index.js
     * @param {Segment} segment - quiz/index.js
     * @param {object} nextSection
     */
    const startQuiz = (quizContext, segment, section) => {
      const quizSpec = quizContext.value.config.options;
      quizSpec
        .reload(section, [segment.start, segment.end], () =>
          segment.getSentences()
        )
        .then(() => {
          store.commit("ui/hideMenu");
          store.commit("quiz/hideHint");
          quiz.loadQuiz();
        });
    };
    /**
     * 현재 퀴즈를 다시 한번
     */
    const retry = () => {
      const [s, e] = ctx.value.ranges;
      const segments = ctx.value.getSegments();
      const segment = segments.find((seg) => seg.start === s && seg.end === e);
      startQuiz(ctx, segment, ctx.value.section);
    };
    /**
     * 다음 퀴즈를 시작함.
     *
     */
    const startNext = () => {
      console.log("다음 문제");
      const { section, ranges } = ctx.value;
      const e = ranges[1];
      let segments = ctx.value.getSegments();
      let nextSection = section;
      let nextSegment = segments.find((seg) => seg.start === e);
      if (!nextSegment) {
        nextSection = nextSection.next;
        if (nextSection.level === -1 && ctx.value.isWord()) {
          // "낱말"인 경우, 다음 section이 도전인 경우(level -1)그 다음 section을 사용함
          nextSection = nextSection.next;
        }
        segments = Segment.createSegments(nextSection, ctx.value.resourceType);
        nextSegment = segments[0];
      }
      if (nextSegment) {
        // 맨 마지막 chapter의 마지막 section은 다음 section이 없음
        startQuiz(ctx, nextSegment, nextSection);
      } else {
        alert("마지막 퀴즈입니다.");
      }
    };
    /**
     * provide
     * @method quizProvider.retry - [다시 하기] 현재 퀴즈를 다시
     * @method quizProvider.startNext - [다음 단계] 다음 문제 시작
     * @method quizProvider.gotoSection - [학습선택] section 상세 페이지로 이동
     * @method quizProvider.closeQuiz - 종료. "/level", "/book"으로 이동
     */
    provide("quizProvider", {
      retry,
      startNext,
      gotoSection,
      closeQuiz,
    });
    onBeforeRouteLeave(() => {
      store.commit("quiz/closeQuiz");
      return true;
    });
    onMounted(() => {
      store.commit("ui/hideReward");
      store.commit("ui/setBackgroundVisible", false);
    });
    onUnmounted(() => {
      store.commit("ui/setBackgroundVisible", true);
      store.commit("ui/setNavVisible", true);
    });
    return {
      ctx,
      theme,
      hint,
      reward,
      focusing,
      // keyConsumer,
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
@import "~@/assets/resizer";
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
  @include mobile {
    row-gap: 0;
  }
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
