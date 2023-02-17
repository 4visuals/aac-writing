<template>
  <div class="section-detail" :class="theme">
    <template v-if="cate">
      <BookNavBar
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
        />
      </div>
      <div class="body" v-else>
        <QuestionList
          quizMode="READING"
          answerType="EJ"
          theme="brown"
          :wordMode="false"
          :section="cate"
          :histories="sectionHistories"
          :sentences="sentencesRef"
          @choosen="startQuiz"
        />
        <QuestionList
          quizMode="LEARNING"
          answerType="EJ"
          theme="brown"
          :wordMode="false"
          :section="cate"
          :histories="sectionHistories"
          :sentences="sentencesRef"
          @choosen="startQuiz"
        />
        <QuestionList
          quizMode="QUIZ"
          answerType="SEN"
          theme="brown"
          :wordMode="false"
          :section="cate"
          :histories="sectionHistories"
          :sentences="sentencesRef"
          @choosen="startQuiz"
        />
        <QuestionList
          quizMode="LISTEN"
          answerType="NULL"
          theme="brown"
          :wordMode="false"
          :section="cate"
          :histories="sectionHistories"
          :sentences="sentencesRef"
          @choosen="startQuiz"
        />
      </div>
    </template>
  </div>
</template>

<script>
import { path } from "@/service/util";
import { computed, ref, watch } from "vue";
import router from "@/router";
import { useRoute } from "vue-router";
import { quizDao } from "@/dao";
import QuestionList from "@/components/QuestionList.vue";
import { QuizModeText } from "@/components/quiz/text-map";
import { useStore } from "vuex";
import Slide from "@/components/slide/Slide.vue";
import BookNavBar from "./BookNavBar.vue";
import QuizSpec from "../quiz/type-quiz-spec";

export default {
  components: {
    Slide,
    QuestionList,
    BookNavBar,
  },
  setup(props, { emit }) {
    const store = useStore();
    const route = useRoute();
    const activeLicense = computed(() => store.getters["exam/activeLicense"]);
    const sentencesRef = ref([]);
    const examDesc = ref(null);
    const sectionHistories = ref([]);
    const chapters = computed(() => store.state.course.chapters.levels);
    const cate = ref(null);
    const theme = "brown";
    const quizOnly = false;
    const overviewVisible = ref(false);

    /**
     * 보고쓰기("READING"), 연습하기('LEARNING') 또는 받아쓰기('QUIZ')
     */
    const quizModeRef = ref(null);
    /**
     * 정답 입력에 사용할 컴포넌트 종류('EJ' | 'SEN')
     */
    const answerTypeRef = ref(null);

    const setActiveSection = () => {
      const seq = Number.parseInt(route.params.sectionSeq);
      cate.value = store.getters["course/section"](seq);
    };
    const desc = () => {
      const { level, description } = cate.value;
      return `${level}. ${description}`;
    };

    const startQuiz = (e) => {
      const { group, quizMode, answerType } = e;
      if (!activeLicense.value) {
        alert("학생을 선택해주세요");
        return;
      }
      QuizSpec.prepareBookQuiz(
        quizMode,
        answerType,
        cate.value,
        () => group.sentences,
        [group.start, group.end]
      )
        .then(() => {
          router.push(`/quiz/${cate.value.seq}`);
        })
        .catch((e) => {
          alert(`[${e.cause}]이용 가능한 문제가 없습니다`);
        });
    };

    const findQuizHistories = () => {
      const quizResource = "S";
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

      quizModeRef.value = quizMode;
      answerTypeRef.value = answerType;
      const quizResource = "S";
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
    const sourceText = () => "문장";

    const showOverview = (visible) => (overviewVisible.value = visible);
    const moveBack = () => {
      if (overviewVisible.value) {
        overviewVisible.value = false;
      } else {
        emit("back");
      }
    };

    watch(() => chapters.value, setActiveSection, { immediate: true });
    return {
      overviewVisible,
      cate,
      theme,
      quizOnly,
      path,
      desc,
      examDesc,
      quizModeRef,
      sentencesRef,
      sectionHistories,
      startQuiz,
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
$padding: 16px;
.section-detail {
  display: flex;
  flex-direction: column;
  border-radius: 2vmin;
  overflow: hidden;
  background-color: white;
  height: 100%;

  .header {
    padding: 13px $padding;
    .title {
      display: flex;
      column-gap: 16px;
      align-items: center;
      h3 {
        flex: 1 1 auto;
        display: inline-flex;
        align-items: center;
        font-size: 20px;
        .main {
          padding-left: 16px;
          font-weight: 600;
          line-height: 42px;
        }
        .sub {
          margin-left: 16px;
          font-size: 0.7em;
          font-weight: 400;
        }
      }
      h4 {
        font-weight: 600;
      }
      .overview {
        cursor: pointer;
      }
      .icon {
        font-size: 32px;
        transform: rotate(90deg);
      }
    }
  }
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
  &.blue {
    .header {
      background-color: #4b7bec;
      color: white;
    }
  }
  &.brown {
    .header {
      background-color: #ffd110;
      color: #865900;
    }
  }
  &.pink {
    .header {
      background-color: var(--aac-color-pink-400);
      color: var(--aac-color-pink-900);
    }
  }
  &.green {
    .header {
      background-color: var(--aac-color-green-400);
      color: var(--aac-color-green-900);
    }
  }
  .body {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    position: relative;
    // align-items: flex-start;
    padding: 48px 0;

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
  .footer {
    .choose {
      display: flex;
      justify-content: space-evenly;
      padding: $padding;
      column-gap: 1rem;
      h4 {
        flex: 1 1 auto;
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
