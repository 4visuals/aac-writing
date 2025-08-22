<template>
  <div class="container-fluid layout-h-child">
    <div v-if="ctx" class="quiz-wrapper">
      <LevelNavBar
        :section="ctx.config.section"
        :resourceType="ctx.resourceType"
        @back="closeQuiz"
      />
      <QuizResult v-if="quizFinished" />
      <template v-else>
        <Numbering @speak="speak" :theme="navbarTheme" />
        <div class="question">
          <ko-writing-node
            v-if="words.length > 0"
            :words="words"
            :index="index"
            @dir="onWordChanged"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import quiz from "@/views/quiz";
import { computed, onUnmounted, ref, watch, provide } from "vue";
import { useStore } from "vuex";
import LevelNavBar from "../level/LevelNavBar.vue";
import Numbering from "@/views/quiz/Numbering.vue";
import QuizResult from "../quiz/result/QuizResult.vue";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import "../../assets/writing/ko-writing.js";
import quizStore from "../quiz/quizStore";
import { tts } from "@/components/tts";
import { path } from "../../service/util.js";
import { RetryMode } from "../../components/quiz/retry-mode.js";
import { Segment } from "../quiz/index.js";

const store = useStore();
const router = useRouter();
const navbarTheme = ref("word");
const ctx = computed(() => store.state.quiz.quizContext);
store.commit("ui/hideMenu");
store.commit("quiz/hideHint");
store.commit("ui/setNavVisible", false);
const words = ref([]);
const index = ref(0);
const quizFinished = computed(() => store.state.quiz.finished);
store.commit("ui/setTheme", ["writing"]);
quiz.loadQuiz();

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
const moveQuiz = (dir) => {
  // if (!ctx.value.isReadingMode()) {
  //   holdSoftKeyboard();
  // }
  if (dir > 0) {
    quizStore.moveNext();
    index.value = Math.min(9, index.value + 1);
  } else {
    quizStore.movePrev();
    index.value = Math.max(0, index.value - 1);
  }
  // holdSoftKeyboard();
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
const onWordChanged = (e) => {
  moveQuiz(e.detail);
};
const speak = () => {
  return tts.speak(ctx.value.currentQuestion.text);
};
watch(
  ctx,
  () => {
    if (ctx.value) {
      words.value = ctx.value.questions.map((q) => ({
        text: q.text,
        picture: path.aacweb.symbol(q.eojeols[0].picturePath.split(":")[1]),
      }));
      speak();
    }
  },
  {
    immediate: true,
  }
);
watch(quizFinished, (finished) => {
  index.value = 0;
  console.log("오냐?");
});
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
  // speakNextQuestion(sentences);
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
   * 뭔지 모르겠다.
   */
  const quizContext = ctx.value;
  const [s, e] = quizContext.ranges;
  let segment = { start: s, end: e }; // = segments.find((seg) => seg.start === s && seg.end === e);
  let sentences = quizContext.getRetrySentences();
  const { retryMode } = quizContext;
  const failedOnly = retryMode === RetryMode.FAILED;
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
    RetryMode.FAILED,
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
    const nextSetences = nextSegment.getSentences();
    // 맨 마지막 chapter의 마지막 section은 다음 section이 없음
    startQuiz(
      ctx,
      nextSegment,
      nextSection,
      nextSetences,
      RetryMode.SEG,
      failedOnly
    );
  } else {
    alert("마지막 퀴즈입니다.");
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
onUnmounted(() => {
  store.commit("ui/setBackgroundVisible", true);
  store.commit("ui/setNavVisible", true);
});
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
  .trial-info {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, -8px);
    background-color: #f3ff09;
    padding: 6px 12px;
    border-radius: 24px;
    box-shadow: 0 0 1px #555107cc;
    animation: bouncing-updown 2s cubic-bezier(0.5, 0, 0.5, 1) 0s infinite;
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
