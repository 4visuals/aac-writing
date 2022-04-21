<template>
  <div class="section-detail" :class="theme">
    <div class="jumbo">
      <div class="title">
        <h3>{{ title() }}</h3>
        <LicenseComboBox />
        <SwitchButton
          v-model:selected="wordMode"
          :disabled="quizOnly === '' || quizOnly === true"
          onText="낱말"
          offText="문장"
        />
      </div>
    </div>
    <div class="body">
      <div class="ko-char-view">
        <ParaText class="desc">{{ cate.description }}</ParaText>
        <Slide
          :resources="cate.notes.map((n) => n.text)"
          :width="400"
          :height="300"
          :resolveUrl="(rss) => path.aacweb.scene(rss)"
        />
      </div>
    </div>
    <div class="footer">
      <div class="choose">
        <AacButton
          :text="`${sourceText()} 읽기`"
          theme="orange"
          :disabled="quizOnly === '' || quizOnly === true"
        />
        <AacButton
          :text="`${sourceText()} 쓰기`"
          theme="blue"
          :disabled="quizOnly === '' || quizOnly === true"
          @click="startSentenceQuiz('LEARNING', 'EJ')"
        />
        <AacButton
          :text="`${sourceText()} 퀴즈`"
          theme="red"
          @click="startSentenceQuiz('QUIZ', 'SEN')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { path } from "@/service/util";
import { computed, ref } from "vue";
import router from "@/router";
import { ParaText } from "@/components/text";
import { SwitchButton } from "@/components/form";
// import { Char } from "@/components";
import { AacButton } from "@/components/form";
import { Slide } from "@/components/slide";
import { LicenseComboBox } from "@/components/admin";

// import api from "@/service/api";
import quiz from "@/views/quiz";
import { useStore } from "vuex";
export default {
  props: ["cate", "theme", "quizOnly"],
  components: {
    AacButton,
    ParaText,
    SwitchButton,
    Slide,
    LicenseComboBox,
    // Char,
  },
  setup(props) {
    const store = useStore();
    const activeLicense = computed(() => store.getters["exam/activeLicense"]);
    const wordMode = ref(true);
    if (props.quizOnly) {
      wordMode.value = false;
    }
    const title = () => {
      const { level } = props.cate;
      return level >= 0 ? level + "단계" : "종합";
    };
    /**
     * @param quizMode 학습모드('LEARNING') 또는 시험모드('QUIZ')
     * @param answerType 문제에 대한 정답 입력에 사용할 컴포넌트 종류('EJ' | 'SEN')
     */
    const startSentenceQuiz = (quizMode, answerType) => {
      if (!activeLicense.value) {
        alert("학생을 선택해주세요");
        return;
      }
      const sectionSeq = props.cate.seq;
      const quizResource = wordMode.value ? "W" : "S";
      /*
       * 단어 학습인 경우 무조건 받아쓰기 모드
       */
      answerType = quizResource === "W" ? "SEN" : answerType;

      quiz
        .prepareQuiz({
          quizMode,
          answerType,
          section: sectionSeq,
          quizResource,
          license: activeLicense.value.seq,
        })
        .then(() => {
          router.push(`/quiz/${sectionSeq}`);
        })
        .catch((e) => {
          alert(`[${e.cause}]이용 가능한 문제가 없습니다`);
        });
    };

    const sourceText = () => (wordMode.value ? "낱말" : "문장");

    return {
      path,
      title,
      wordMode,
      startSentenceQuiz,
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
  .body {
    flex: 1 1 auto;
  }
  .jumbo {
    .title {
      display: flex;
      column-gap: 8px;
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
    .ko-char-view {
      display: flex;
      // align-items: flex-start;
      padding: $padding;
      flex-direction: column;
      .desc {
        padding-bottom: 16px;
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
