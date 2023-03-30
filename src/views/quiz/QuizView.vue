<template>
  <div class="container layout-h-child w-1190px">
    <div v-if="ctx" class="quiz-wrapper">
      <LevelNavBar
        v-if="ctx.isLevelQuiz()"
        :section="ctx.config.section"
        :resourceType="ctx.resourceType"
        @back="closeQuiz"
      />
      <BookNavBar
        v-else-if="ctx.isBookQuiz()"
        :section="ctx.config.section"
        :resourceType="ctx.resourceType"
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
import { RetryMode } from "../../components/quiz/retry-mode";

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
      holdSoftKeyboard();
      if (ctx.value.isListenMode()) {
        /**
         * 듣고쓰기 모드에서 장면 클릭시
         *
         * 장면 사진 클릭할때 EojeolInput이나 SentenceInput에서 tts 출력 후 포커스를 관리했음.
         * 듣고쓰기 모드에서는 정답 입력 컴포넌트가 없으므로 여기서 tts를 출력함
         */
        tts.speak(ctx.value.currentQuestion.text, { clearPending: true });
      }
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
    const gotoChapter = () => {
      router.replace({ name: ctx.value.getMainPath() });
    };
    /**
     * 새로운 퀴즈 시작
     * @param {QuizContext} quizContext - quiz/index.js
     * @param {Segment} segment - quiz/index.js
     * @param {object} section,
     * @param {object[]} sentences
     * @param {RetryMode} retryMode 현재 segment인지, 오답연습인지
     * @param {Boolean} failedOnly segment에서 틀린 문제만 다시 풀기
     */
    const startQuiz = (
      quizContext,
      segment,
      section,
      sentences,
      retryMode,
      failedOnly = false
    ) => {
      const config = quizContext.value.config; // 지우기 전에 미리 받아놓음.
      store.dispatch("quiz/closeQuiz").then(() => {
        const quizSpec = config.options;
        quizSpec
          .reload(
            section,
            [segment.start, segment.end],
            () => sentences,
            retryMode,
            failedOnly
          )
          .then(() => {
            store.commit("ui/hideMenu");
            store.commit("quiz/hideHint");
            quiz.loadQuiz();
          });
      });
    };
    /**
     * 현재 퀴즈를 다시 한번
     *
     * @param {RetryMode} retryMode - 'SEG'이면 현재 segment를, 'FAILED'이면 section의 오답들을 다시 풀기
     */
    const retry = () => {
      /**
       * 최초에 특정 segment를 풀고 난 후
       * 첫 번째 결과화면에서 [틀린 문제 풀기]를 눌러서 두번째 시험을 진행함.
       * 두 번째 결과 화면에서 [다시하기]를 누르는 경우,
       *
       * 현재 문제가 속한 section의 segment를 다시 풀어야 함(보통 10문제).
       * (방금 풀었던 문제들은, ctx.questions, 더이상 최초에 풀었던 문제들이 아닐 수 있음. 틀린 문제들만 존재함)
       *
       * 그런데 최초에 진행한 segment가 [오답풀기]인 경우
       * 1회 이상의 [틀린 문제 풀기] 진행 후에 결과 화면에서 [다시하기]를 누르는 경우
       * 현재의 segment가 아니라 오답 자체를 전부 다시 풀어야 함.
       *
       */
      const quizContext = ctx.value;
      const [s, e] = quizContext.ranges;
      const segments = quizContext.getSegments();
      let segment; // = segments.find((seg) => seg.start === s && seg.end === e);
      let sentences;
      const { retryMode } = quizContext;
      if (retryMode === RetryMode.SEG) {
        segment = segments.find((seg) => seg.start === s && seg.end === e);
        sentences = segment.getSentences();
      } else {
        const { section } = quizContext;
        const quizResource = quizContext.isWord() ? "W" : "S";
        const records = store.getters["record/wrongAnswers"](section);
        const sentenceSeqs = records
          .filter((record) => record.type === quizResource)
          .flatMap((record) =>
            record.paper.submissions.flatMap((sbm) => sbm.sentenceRef)
          );
        sentences = section.sentences.filter((sen) =>
          sentenceSeqs.includes(sen.seq)
        );
        segment = { start: 0, end: sentences.length };
      }
      const failedOnly = false;
      startQuiz(
        ctx,
        segment,
        quizContext.section,
        sentences,
        retryMode,
        failedOnly
      );
    };
    /**
     * 틀린 문제 다시 풀기
     * - [오답 연습]과 다름
     * - 현재 진행중인 시험 문제에서 틀린 문제만 다시 시도함.
     * @param {import("./result/scoring").default} scoring
     */
    const tryFailedQuestion = (scoring) => {
      const quizContext = ctx.value;
      let segment;
      let sentences = scoring.trials
        .filter((trial) => !trial.correct)
        .map((trial) => trial.sentence);
      if (quizContext.retryMode === RetryMode.SEG) {
        let segments = quizContext.getSegments();
        const [s, e] = quizContext.ranges;
        segment = segments.find((seg) => seg.start === s && seg.end === e);
      } else {
        segment = { start: 0, end: sentences.length };
      }
      const failedOnly = true;
      startQuiz(
        ctx,
        segment,
        quizContext.section,
        sentences,
        quizContext.retryMode,
        failedOnly
      );
    };
    /**
     * 다음 퀴즈를 시작함.
     *
     */
    const startNext = () => {
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
        const failedOnly = false;
        // 맨 마지막 chapter의 마지막 section은 다음 section이 없음
        startQuiz(
          ctx,
          nextSegment,
          nextSection,
          nextSegment.getSentences(),
          RetryMode.SEG,
          failedOnly
        );
      } else {
        alert("마지막 퀴즈입니다.");
      }
    };
    const closeQuiz = (dir) => {
      if (dir === "back") {
        gotoSection();
      } else if (dir === "close") {
        gotoChapter();
      } else {
        throw new Error("invalid dir", dir);
      }
    };
    /**
     * provide
     * @method quizProvider.retry - [다시 하기] 현재 퀴즈를 다시
     * @method quizProvider.tryFailedQuestion - 현재 퀴즈에서 틀린 문제만
     * @method quizProvider.startNext - [다음 단계] 다음 문제 시작
     * @method quizProvider.gotoSection - [학습선택] section 상세 페이지로 이동
     * @method quizProvider.gotoChapter - 종료. "/level", "/book"으로 이동
     */
    provide("quizProvider", {
      retry,
      tryFailedQuestion,
      startNext,
      gotoSection,
      gotoChapter,
    });
    onBeforeRouteLeave(() => {
      store.dispatch("quiz/closeQuiz");
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
        background-color: #dafdff;
      }
    }
    &.brown {
      h3 {
        color: #865900;
        background-color: #fffad5;
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
