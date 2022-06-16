<template>
  <div
    class="section-detail"
    :class="theme.bgc"
    :style="`--bname-bgc: ${theme.button.bgc}; --bname-fgc: ${theme.button.color}`"
  >
    <div class="jumbo">
      <div class="title">
        <h3>{{ title() }}</h3>
        <LicenseComboBox />
      </div>
    </div>
    <div class="body">
      <div class="ko-char-view">
        <ParaText class="desc">{{ cate.description }}</ParaText>
        <div class="steps">
          <SpanText
            class="group"
            :class="{ active: activeGroup === group }"
            v-for="group in groups"
            :key="group"
            @click="setActiveGroup(group)"
            >{{ group.text }}</SpanText
          >
        </div>
        <transition name="fade" @enter="markHeight">
          <div class="sentences" v-if="activeGroup">
            <ParaText v-for="sen in activeGroup.sentences" :key="sen.seq">{{
              sen.sentence
            }}</ParaText>
          </div>
        </transition>
      </div>
    </div>
    <div class="footer">
      <div class="choose">
        <AacButton
          :text="`보고 쓰기`"
          theme="orange"
          :disabled="!activeGroup"
          size="sm"
          @click="startLearning('READING', 'SEN')"
        />
        <AacButton
          :text="`문장 학습`"
          theme="blue"
          :disabled="!activeGroup"
          size="sm"
          @click="startLearning('LEARNING', 'EJ')"
        />
        <AacButton
          :text="`문장 퀴즈`"
          theme="red"
          :disabled="!activeGroup"
          size="sm"
          @click="startLearning('QUIZ', 'SEN')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { path } from "@/service/util";
import { computed, ref } from "vue";
import router from "@/router";
import { ParaText, SpanText } from "@/components/text";
import { AacButton } from "@/components/form";
import { LicenseComboBox } from "@/components/admin";
import util from "@/service/util";

// import api from "@/service/api";
import quiz from "@/views/quiz";
import { useStore } from "vuex";
export default {
  props: ["cate", "theme"],
  components: {
    AacButton,
    ParaText,
    LicenseComboBox,
    SpanText,
  },
  setup(props) {
    console.log(props.theme);
    const store = useStore();
    const activeLicense = computed(() => store.getters["exam/activeLicense"]);
    // eslint-disable-next-line vue/no-setup-props-destructure
    const { sentences } = props.cate;
    const activeGroup = ref(null);
    const groups = ref([]);
    for (let k = 0; k < sentences.length; k += 10) {
      const end = Math.min(k + 10, sentences.length);
      const ranges = sentences.slice(k, end);
      groups.value.push({
        text: k / 10 + 1,
        sentences: ranges,
      });
    }
    groups.value.push({
      text: "종합",
      rand: true,
      sentences: null,
    });

    const setActiveGroup = (group) => {
      activeGroup.value = group;
      if (group.rand) {
        activeGroup.value.sentences = util.pick(sentences, 10);
      }
    };
    const title = () => {
      const { level } = props.cate;
      return level >= 0 ? level + "단계" : "종합";
    };
    const markHeight = (e) => {
      console.log("[h]", e.offsetHeight);
      const height = [...e.children].reduce((h, p) => h + p.offsetHeight, 0);
      const style = window.getComputedStyle(e);
      const pad = parseInt(style.paddingTop) + parseInt(style.paddingBottom);
      e.style.height = pad + height + "px";
    };
    /**
     * @param quizMode 학습모드('LEARNING') 또는 시험모드('QUIZ')
     * @param answerType 문제에 대한 정답 입력에 사용할 컴포넌트 종류('EJ' | 'SEN')
     */
    const startLearning = (quizMode, componentType) => {
      if (!activeLicense.value) {
        alert("학생을 선택해주세요");
        return;
      }
      const sectionSeq = props.cate.seq;
      const range = ref(null);
      const quizResource = "A";
      /*
       * 단어 학습인 경우 무조건 받아쓰기 모드
       */
      // const answerType = quizResource === "W" ? "SEN" : answerType;

      quiz
        .prepareQuiz({
          quizMode,
          answerType: { comp: componentType, pumsa: "what" },
          section: sectionSeq,
          range: range.value,
          quizResource,
          license: activeLicense.value.seq,
          prevPage: "BookShelfView",
          sentenceFilter: () => activeGroup.value.sentences,
        })
        .then(() => {
          router.push(`/quiz/${sectionSeq}`);
        })
        .catch((e) => {
          alert(`[${e.cause}]이용 가능한 문제가 없습니다`);
        });
    };

    return {
      path,
      title,
      groups,
      activeGroup,
      startLearning,
      setActiveGroup,
      markHeight,
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
  &.gold {
    .jumbo {
      background-color: var(--aac-color-yellow-400);
      color: var(--aac-color-yellow-900);
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
      .steps {
        display: flex;
        column-gap: 16px;
        justify-content: center;
        .group {
          width: 40px;
          display: inline-flex;
          justify-content: center;
          border-radius: 8px;
          padding: 8px 0;
          background-color: #ffeb3b;
          color: #865900;
          user-select: none;
          cursor: pointer;
          &.active {
            box-shadow: 0 0 8px 1px #7865009c;
          }
        }
      }
      .sentences {
        display: flex;
        flex-direction: column;
        border: 1px solid #a87d00;
        background-color: var(--bname-bgc);
        margin-top: 1rem;
        border-radius: 8px;
        padding: 8px;
        color: var(--bname-fgc);
        height: 270px;
        &.fade-enter-from,
        &.fade-leave-to {
          height: 0px;
        }
        &.fade-enter-active {
          overflow: hidden;
          transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        &.fade-leave-active {
          overflow: hidden;
          transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
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
