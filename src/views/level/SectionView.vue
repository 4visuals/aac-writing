<template>
  <div class="section-detail" :class="theme">
    <div class="jumbo">
      <div class="title">
        <h3>{{ title() }}</h3>
        <SwitchButton
          v-model:selected="wordMode"
          :disabled="quizOnly === '' || quizOnly === true"
          onText="낱말"
          offText="문장"
        />
      </div>
    </div>
    <div class="body">
      <Slide
        class="preview"
        :resources="cate.notes.map((n) => n.text)"
        :width="600"
        height="100%"
        :resolveUrl="(rss) => path.aacweb.scene(rss)"
      />
      <div class="overlay" v-if="sentencesRef.length > 0">
        <h4>{{ examDesc }}</h4>
        <QuestionList
          :histories="sectionHistories"
          :sentences="sentencesRef"
          @choosen="startSentenceQuiz"
        />
      </div>
    </div>
    <div class="footer">
      <div class="choose">
        <AacButton
          :text="`보고 쓰기`"
          theme="orange"
          :disabled="quizOnly === '' || quizOnly === true"
          @click="listQuestions('READING', 'EJ')"
        />
        <AacButton
          :text="`${sourceText()} 학습`"
          theme="blue"
          :disabled="quizOnly === '' || quizOnly === true"
          @click="listQuestions('LEARNING', 'EJ')"
        />
        <AacButton
          :text="`${sourceText()} 퀴즈`"
          theme="red"
          @click="listQuestions('QUIZ', 'SEN')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { path } from "@/service/util";
import { computed, ref, watch } from "vue";
import router from "@/router";
import { quizDao } from "@/dao";
import { SwitchButton } from "@/components/form";
import QuestionList from "@/components/QuestionList.vue";
import { AacButton } from "@/components/form";
import { Slide } from "@/components/slide";
import quiz from "@/views/quiz";
import { useStore } from "vuex";
export default {
  props: ["cate", "theme", "quizOnly"],
  components: {
    AacButton,
    SwitchButton,
    Slide,
    QuestionList,
  },
  setup(props) {
    const store = useStore();
    const activeLicense = computed(() => store.getters["exam/activeLicense"]);
    const wordMode = ref(true);
    const sentencesRef = ref([]);
    const examDesc = ref(null);
    const sectionHistories = ref([]);

    /**
     * 받아쓰기("READING"), 학습모드('LEARNING') 또는 시험모드('QUIZ')
     */
    const quizModeRef = ref(null);
    /**
     * 정답 입력에 사용할 컴포넌트 종류('EJ' | 'SEN')
     */
    const answerTypeRef = ref(null);

    const descritions = {
      READING: "보고 쓰기",
      LEARNING: "학습",
      QUIZ: "퀴즈",
    };
    if (props.quizOnly) {
      wordMode.value = false;
    }
    const title = () => {
      const { level } = props.cate;
      return level >= 0 ? level + "단계" : "종합";
    };

    const startSentenceQuiz = (e) => {
      if (!activeLicense.value) {
        alert("학생을 선택해주세요");
        return;
      }
      const quizMode = quizModeRef.value;
      const sectionSeq = props.cate.seq;
      const quizResource = wordMode.value ? "W" : "S";
      /*
       * 단어 학습인 경우 무조건 받아쓰기 모드
       */
      const answerType = quizResource === "W" ? "SEN" : answerTypeRef.value;
      quiz
        .prepareQuiz({
          quizMode,
          answerType,
          section: sectionSeq,
          quizResource,
          license: activeLicense.value.seq,
          prevPage: "LevelView",
          sentenceFilter: () => e.sentences,
          ranges: [e.start, e.end],
        })
        .then(() => {
          router.push(`/quiz/${sectionSeq}`);
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
        props.cate.seq,
        quizResource,
        mode
      );
      // .then((res) => {
      //   quizHistories.value.push(...res);
      // });
    };

    const replace = (arrayRef, elems) => {
      arrayRef.value.splice(0, arrayRef.value.length);
      arrayRef.value.push(...elems);
    };
    /**
     * @param quizMode 받아쓰기("READING"), 학습모드('LEARNING') 또는 시험모드('QUIZ')
     * @param answerType 정답 입력에 사용할 컴포넌트 종류('EJ' | 'SEN')
     */
    const listQuestions = (quizMode, answerType) => {
      if (!activeLicense.value) {
        alert("학생을 선택해주세요");
        return;
      }
      quizModeRef.value = quizMode;
      answerTypeRef.value = answerType;
      const quizResource = wordMode.value ? "W" : "S";
      const sentences = props.cate.sentences.filter(
        (sen) => sen.type === quizResource
      );
      examDesc.value = sourceText() + " " + descritions[quizMode];
      findQuizHistories().then((histories) => {
        replace(sectionHistories, histories);
        replace(sentencesRef, sentences);
      });
    };

    const sourceText = () => (wordMode.value ? "낱말" : "문장");

    watch(
      () => wordMode.value,
      () => {
        sentencesRef.value.splice(0, sentencesRef.value.length);
      }
    );
    return {
      path,
      title,
      wordMode,
      examDesc,
      quizModeRef,
      sentencesRef,
      sectionHistories,
      startSentenceQuiz,
      listQuestions,
      sourceText,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
$padding: 16px;
.section-detail {
  height: 100%;
  display: flex;
  flex-direction: column;
  border-top-left-radius: 2vmin;
  border-top-right-radius: 2vmin;
  overflow: hidden;
  .body {
    flex: 1 1 auto;
  }
  .jumbo {
    .title {
      display: flex;
      column-gap: 8px;
      align-items: center;
      h3 {
        flex: 1 1 auto;
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
  &.pink {
    .jumbo {
      background-color: var(--aac-color-pink-400);
      color: var(--aac-color-pink-900);
      padding: 16px $padding;
    }
  }
  &.green {
    .jumbo {
      background-color: var(--aac-color-green-400);
      color: var(--aac-color-green-900);
      padding: 16px $padding;
    }
  }
  .body {
    display: flex;
    position: relative;
    // align-items: flex-start;
    padding: 0;
    flex-direction: column;
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
      left: 16px;
      right: 16px;
      bottom: 16px;
      z-index: 50;
      background-color: #fffffffe;
      border-radius: 8px;
      box-shadow: rgb(14 30 37 / 12%) 0px 2px 4px 0px,
        rgb(14 30 37 / 32%) 0px 2px 16px 0px;
      h4 {
        padding: 8px;
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
}
</style>
