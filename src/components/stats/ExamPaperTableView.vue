<template>
  <div class="exam-table">
    <div class="head">
      <ActionIcon icon="chevron_left" @click="$emit('close')" />
      <h3>{{ date.toYMD() }}</h3>
    </div>
    <div class="table">
      <table>
        <tr class="header">
          <th class="min w60 align-center">
            <SpanText size="sm">NO</SpanText>
          </th>
          <th class="nowrap w160">
            <SpanText size="sm">단계</SpanText>
          </th>
          <th class="w160"></th>
          <th class="min w80"><SpanText size="sm">종류</SpanText></th>
          <th class="min w100 align-center">
            <SpanText size="sm">학습유형</SpanText>
          </th>
          <th class="min w80"><SpanText size="sm">점수</SpanText></th>
        </tr>
        <tr
          v-for="(pair, idx) in sheets"
          :key="pair.paper.seq"
          :class="idx % 2 == 1 ? 'even' : 'odd'"
          @click.stop="$emit('view-submissions', pair)"
        >
          <td class="min w60 align-center">
            <SpanText size="sm">{{ idx + 1 }}</SpanText>
          </td>
          <td class="nowrap w160">
            <SpanText class="nowrap" size="sm">{{
              formatChapterTitle(pair.section.chapter)
            }}</SpanText>
          </td>
          <td class="nowrap w160">
            <SpanText class="nowrap" size="sm"
              >{{ pair.section.level === -1 ? "도전" : pair.section.level }}.
              {{
                pair.section.level === -1 ? "" : pair.section.description
              }}</SpanText
            >
          </td>
          <td class="min w80">
            <SpanText size="sm">{{ examType(pair.paper) }}</SpanText>
          </td>
          <td class="min w100 align-center">
            <SpanText size="sm">{{ mode(pair.paper) }}</SpanText>
          </td>
          <td class="min w80">
            <SpanText size="sm"
              ><button class="anchor">
                {{ score(pair.paper) }}
              </button></SpanText
            >
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { ActionIcon } from "../../components/form";
// import { TableView, Row, Cell } from "@/components/table";
import { shallowRef } from "vue";
import { SpanText } from "@/components/text";
import { useStore } from "vuex";
import util from "@/service/util";
export default {
  components: {
    ActionIcon,
    SpanText,
    // TableView,
    // Row,
    // Cell,
    // SentenceExamResult,
  },
  props: ["date", "papers"],
  setup(props) {
    const types = { W: "낱말", S: "문장", B: "교과서" };
    const modes = { L: "연습하기", Q: "받아쓰기", R: "보고쓰기" };
    const store = useStore();
    const sheets = shallowRef([]);

    const examType = (paper) => {
      const { origin, type } = paper;
      if (origin === "L") {
        return types[type];
      } else {
        return types.B;
      }
    };
    const mode = (paper) => {
      const mode = modes[paper.mode];
      const range = paper.questionOffset / 10 + 1;
      return `${mode} ${range}`;
    };
    /**
     * 문장 S를 구성하는 각 어절들을 모두 맞혀야 정답 처리함
     * (오답이 여러개 제출된 후 정답을 맞힌 경우는 최종 오답으로 처리함)
     * @param {Object} paper
     */
    const countByEojeols = (paper) => {
      const { submissions } = paper;
      // 1. 제출된 어절을 문장, 어절로 분류함
      /*
       * {4: {
       *   12: [...], // 어절 12에 대한 답안들
       *   45: [...]  // 어절 45에 대한 댭안들
       *   }
       * }
       */
      const groups = util.arr.unflat(submissions, {}, (sbm) => [
        sbm.sentenceRef,
        sbm.eojeolRef,
      ]);
      const section = store.getters["course/section"](paper.sectionRef);
      let sentences = [];
      Object.keys(groups).forEach((senSeq) => {
        const sentence = section.sentences.find((sen) => sen.seq === +senSeq);
        const { eojeols } = sentence;
        // 2. 각 어절마다 정답의 갯수를 센 후
        const corrects = eojeols.reduce((acc, ej) => {
          const trials = groups[senSeq]["" + ej.eojeolRef];
          if (!trials || trials.length === 0) {
            return acc;
          }
          return acc + (trials[0].correct ? 1 : 0);
        }, 0);
        // 3. 문장의 어절 갯수와 정답의 갯수가 같으면 한 문제를 맞췄음.
        if (eojeols.length === corrects) {
          sentences.push(sentence);
        }
      });
      return sentences;
    };
    const countBySentence = (paper) => {
      const groups = util.arr.unflat(paper.submissions, {}, (sbm) => [
        sbm.sentenceRef,
      ]);
      const section = store.getters["course/section"](paper.sectionRef);
      const corrects = [];
      Object.keys(groups).forEach((senSeq) => {
        const sentence = section.sentences.find((sen) => sen.seq === +senSeq);
        if (groups[senSeq][0].correct) {
          corrects.push(sentence);
        }
      });
      return corrects;
    };
    const score = (paper) => {
      const { type, mode } = paper;
      let corrects = [];
      if (type === "S" && mode !== "Q") {
        // 어절입력: 문장 보고쓰기, 문장 학습
        // 어절마다 1개 이상의 답안이 존재함
        corrects = countByEojeols(paper);
      } else {
        // 문장입력: 낱말(보고쓰기,학습,퀴즈) + 문장 퀴즈
        // 하나의 문장에 최대 1개의 입력이 존재함
        corrects = countBySentence(paper);
      }
      const score = (100 * corrects.length) / paper.numOfQuestions;
      return score % 1 === 0 ? score : score.toFixed(1);
    };
    /**
     * 제출 답안 상세 화면
     * @param {object} paper
     */
    const showSubmissions = (paper) => {
      console.log("[입력 상세 정보]", paper);
    };
    const initSheet = () => {
      const pairs = [];
      props.papers.forEach((paper) => {
        const section = store.getters["course/section"](paper.sectionRef);
        pairs.push({ paper, section });
      });
      sheets.value = pairs;
    };
    const formatChapterTitle = (chapter) => {
      if (chapter.origin === "L") {
        const range = util.chapter.rangeText(chapter, ". ");
        const desc = chapter.desc.substring("x. ".length);
        return range + desc;
      } else {
        return chapter.desc;
      }
    };
    initSheet();
    return {
      sheets,
      examType,
      mode,
      score,
      showSubmissions,
      formatChapterTitle,
    };
  },
};
</script>

<style lang="scss" scoped>
.exam-table {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: 720px;
  max-height: 500px;
  // margin: 16px;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 5px 25px, rgba(0, 0, 0, 0.05) 0px 2px 10px;
  border-radius: 8px;
  background-color: white;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .head {
    display: flex;
    column-gap: 8px;
    font-size: 2rem;
    padding: 12px 16px;
  }
  .table {
    overflow-y: auto;
    .nowrap {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    table {
      font-size: 12px;
      width: 100%;
      color: #6b7a99;
      padding-bottom: 16px;
      tr {
        border-top: 1px solid #f5f6f7;
        &:hover {
          background-color: #f1e9f6;
          cursor: pointer;
          color: #9852d5;
        }
        &.header {
          position: sticky;
          top: -1px;
          background-color: white;
          box-shadow: 0 2px 2px #00000010, 0 1px 1px #0000002d;
        }
        td,
        th {
          padding: 6px 0;
          &.w160 {
            max-width: 160px;
          }
          &.w100 {
            max-width: 100px;
            &.min {
              width: 100px;
            }
          }
          &.w80 {
            max-width: 80px;
            &.min {
              width: 80px;
            }
          }
          &.w60 {
            max-width: 60px;
            &.min {
              width: 60px;
            }
          }
          &.w40 {
            max-width: 40px;
            &.min {
              width: 40px;
            }
          }
          &.align {
            &-center {
              text-align: center;
            }
          }
          &.nowrap {
            white-space: nowrap;
          }
          a {
            color: #9852d5;
            text-decoration: none;
          }
        }
      }
    }
    button {
      border: none;
      outline: none;
      background-color: transparent;
      font-family: "Roboto";
      &.anchor {
        color: #9852d5;
        text-decoration: none;
        font-weight: 600;
      }
    }
  }
}
</style>
