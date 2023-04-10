<template>
  <div class="section-detail" :class="theme">
    <template v-if="cate">
      <LevelNavBar
        :section="cate"
        @quizMode="(mode) => (wordMode = mode)"
        @back="moveBack"
        @overview="showOverview"
      />
      <div class="body" v-if="overviewVisible">
        <Slide
          class="preview"
          :resources="cate.notes.map((n) => n.text)"
          :width="600"
          height="100%"
          :resolveUrl="(rss) => path.aacweb.scene(rss)"
          @click="showOverview"
        />
      </div>
      <div class="body" v-else>
        <QuestionList
          quizMode="READING"
          answerType="EJ"
          theme="blue"
          :wordMode="wordMode"
          :section="cate"
          :histories="sectionHistories"
          :sentences="sentencesRef"
          :recordVisible="false"
          @choosen="startSentenceQuiz"
        />
        <QuestionList
          quizMode="LEARNING"
          answerType="EJ"
          theme="blue"
          :wordMode="wordMode"
          :section="cate"
          :histories="sectionHistories"
          :sentences="sentencesRef"
          :recordVisible="false"
          @choosen="startSentenceQuiz"
        />
        <QuestionList
          quizMode="QUIZ"
          answerType="SEN"
          theme="blue"
          :wordMode="wordMode"
          :section="cate"
          :histories="sectionHistories"
          :sentences="sentencesRef"
          :recordVisible="true"
          @choosen="startSentenceQuiz"
          @failed-question="tryFailedQuestion"
        />
        <QuestionList
          quizMode="LISTEN"
          answerType="NULL"
          theme="blue"
          :wordMode="wordMode"
          :section="cate"
          :histories="sectionHistories"
          :sentences="sentencesRef"
          :recordVisible="false"
          @choosen="startSentenceQuiz"
        />
      </div>
    </template>
  </div>
</template>

<script>
import { path } from "@/service/util";
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { quizDao } from "@/dao";
import QuestionList from "@/components/QuestionList.vue";
import { QuizModeText } from "@/components/quiz/text-map";
import { useStore } from "vuex";
import Slide from "@/components/slide/Slide.vue";
import LevelNavBar from "./LevelNavBar.vue";
import QuizSpec from "../quiz/type-quiz-spec";
import { checkAppState } from "../app-state-validator";
import { RetryMode } from "../../components/quiz/retry-mode";

export default {
  components: {
    Slide,
    QuestionList,
    LevelNavBar,
  },
  setup(props, { emit }) {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const activeLicense = computed(() => store.getters["exam/activeLicense"]);
    const wordMode = ref(true);
    const sentencesRef = ref([]);
    const examDesc = ref(null);
    const sectionHistories = ref([]);
    const chapters = computed(() => store.state.course.chapters.levels);
    const cate = ref(null);
    const records = computed(() =>
      store.getters["record/wrongAnswers"](cate.value)
    );
    const theme = "blue";

    const overviewVisible = ref(false);

    /**
     * 보고쓰기("READING"), 연습하기('LEARNING') 또는 받아쓰기('QUIZ')
     */
    const quizModeRef = ref(null);
    /**
     * 정답 입력에 사용할 컴포넌트 종류('EJ' | 'SEN')
     */
    const answerTypeRef = ref(null);

    checkAppState({ router });
    const setActiveSection = () => {
      if (chapters.value.length === 0) {
        return;
      }
      const sectionSeq = Number.parseInt(route.params.sectionSeq);
      cate.value = store.getters["course/section"](sectionSeq);
      if (cate.value.level === -1) {
        wordMode.value = false;
      }
    };
    const title = () => {
      const { level } = cate.value;
      return level >= 0 ? level + "단계" : "도전";
    };
    const desc = () => cate.value.description;

    const startSentenceQuiz = (e) => {
      const { group, quizMode, answerType } = e;
      if (!activeLicense.value) {
        alert("학생을 선택해주세요");
        return;
      }

      const sectionSeq = cate.value.seq;
      const quizResource = wordMode.value ? "W" : "S";
      const failedOnly = false;
      QuizSpec.prepareLevelQuiz(
        quizMode,
        answerType,
        cate.value,
        quizResource,
        () => group.sentences,
        [group.start, group.end],
        RetryMode.SEG,
        failedOnly
      )
        .then(() => {
          router.push(`/quiz/${sectionSeq}`);
        })
        .catch((e) => {
          alert(`[${e.cause}]이용 가능한 문제가 없습니다`);
        });
    };
    /**
     * 오답 연습
     *
     * section을 구성하는 segment들마다 틀린 문제들을 모두 모아서 풀기.
     * 받아쓰기를 모두 틀리면 section의 모든 문제가 다 포함될 수 있음.
     * @param {*} e
     */
    const tryFailedQuestion = (e) => {
      const { quizMode, answerType } = e;
      const quizResource = wordMode.value ? "W" : "S";
      const retryMode = RetryMode.FAILED; // 오답 연습
      const section = cate.value;
      const sentenceSeqs = records.value
        .filter((record) => record.type === quizResource)
        .flatMap((record) =>
          record.paper.submissions.flatMap((sbm) => sbm.sentenceRef)
        );
      const sentences = section.sentences.filter((sen) =>
        sentenceSeqs.includes(sen.seq)
      );
      const failedOnly = false;
      QuizSpec.prepareLevelQuiz(
        quizMode,
        answerType,
        cate.value,
        quizResource,
        () => sentences,
        [0, sentences.length],
        retryMode,
        failedOnly
      )
        .then(() => {
          router.push(`/quiz/${section.seq}`);
        })
        .catch((e) => {
          alert(`[${e.cause}]이용 가능한 문제가 없습니다`);
        });
    };

    const findQuizHistories = () => {
      const quizResource = wordMode.value ? "W" : "S";
      const mode = quizModeRef.value;
      return quizDao.findByQuiz(
        activeLicense.value.uuid,
        cate.value.seq,
        quizResource,
        mode
      );
    };

    const replace = (arrayRef, elems) => {
      arrayRef.value.splice(0, arrayRef.value.length);
      arrayRef.value.push(...elems);
    };
    /**
     * @param quizMode 보고쓰기("READING"), 연습하기('LEARNING') 또는 받아쓰기('QUIZ')
     * @param answerType 정답 입력에 사용할 컴포넌트 종류('EJ' | 'SEN')
     */
    const listQuestions = (quizMode, answerType) => {
      if (!activeLicense.value) {
        alert("학생을 선택해주세요");
        return;
      }
      if (cate.value.level === -1) {
        wordMode.value = false;
      }
      quizModeRef.value = quizMode;
      answerTypeRef.value = answerType;
      const quizResource = wordMode.value ? "W" : "S";
      const sentences = cate.value.sentences.filter(
        (sen) => sen.type === quizResource
      );
      examDesc.value = QuizModeText[quizMode];
      findQuizHistories().then((histories) => {
        replace(sectionHistories, histories);
        replace(sentencesRef, sentences);
      });
    };

    const hideQuestionList = () => {
      sentencesRef.value.length = 0;
    };
    const sourceText = () => (wordMode.value ? "낱말" : "문장");

    const showOverview = () => {
      overviewVisible.value = !overviewVisible.value;
    };
    const moveBack = () => {
      if (overviewVisible.value) {
        overviewVisible.value = false;
      } else {
        emit("back");
      }
    };

    watch(
      () => wordMode.value,
      () => {
        sentencesRef.value.splice(0, sentencesRef.value.length);
      }
    );
    watch(() => chapters.value, setActiveSection, { immediate: true });
    return {
      overviewVisible,
      cate,
      records,
      theme,
      // quizOnly,
      path,
      title,
      desc,
      wordMode,
      examDesc,
      quizModeRef,
      sentencesRef,
      sectionHistories,
      startSentenceQuiz,
      tryFailedQuestion,
      listQuestions,
      hideQuestionList,
      sourceText,
      showOverview,
      moveBack,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
$timing-fn: cubic-bezier(0.5, 0.25, 0, 1);

.section-detail {
  display: flex;
  flex-direction: column;
  border-radius: 2vmin;
  overflow: hidden;
  background-color: white;
  height: 100%;

  @include mobile {
    h3 {
      font-size: 1.5rem;
    }
  }
  @include tablet {
    h3 {
      font-size: 2.5rem;
    }
  }
  @include desktop {
    h3 {
      font-size: 2.5rem;
    }
  }
  .body {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    position: relative;
    // align-items: flex-start;
    padding: 24px 0;

    overflow-y: hidden;
    .desc {
      padding-bottom: 16px;
    }
    .preview {
      flex: 1 1 auto;
    }
    .chars {
      flex: 1;
      display: flex;
      align-items: flex-start;
      flex-wrap: wrap;
      justify-content: flex-start;
      .char-body {
        display: flex;
        align-items: flex-start;
        flex-wrap: wrap;
        justify-content: center;
      }
    }
    .overlay {
      position: absolute;
      left: 0px;
      right: 0px;
      bottom: 0px;
      z-index: 50;
      background-color: #fffffffe;
      border-radius: 8px;
      box-shadow: rgb(14 30 37 / 6%) 0px -4px 2px 0px,
        rgb(14 30 37 / 16%) 0px -6px 8px 0px;
      .quiz-nav {
        padding: 8px;
        display: flex;
        font-size: 2rem;
        align-items: center;
        column-gap: 8px;
        & > span {
          flex: 1;
          font-size: 1.5rem;
        }
      }
    }
  }

  .slideup-enter-from,
  .slideup-leave-to {
    transform: translateY(100%);
    opacity: 0;
  }
  .slideup-enter-active,
  .slideup-leave-active {
    transition: transform 0.3s $timing-fn, opacity 0.3s $timing-fn;
  }
}
</style>
