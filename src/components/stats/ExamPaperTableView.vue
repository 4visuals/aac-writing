<template>
  <div class="exam-table">
    <div class="head">
      <ActionIcon icon="chevron_left" @click="$emit('close')" />
      <h3>{{ date.toYMD() }}</h3>
    </div>
    <TableView class="table" colsize="40px" :colummBased="false">
      <template v-slot:fcol>
        <Cell w="w40" class="event"><SpanText size="sm">#</SpanText></Cell>
        <Cell
          w="w40"
          v-for="(pair, idx) in sheets"
          :key="pair.paper.seq"
          :class="idx % 2 == 1 ? 'even' : 'odd'"
          ><SpanText size="sm">{{ idx + 1 }}</SpanText></Cell
        >
      </template>
      <template v-slot:data>
        <Row>
          <Cell w="w160"><SpanText size="sm">단계</SpanText></Cell>
          <Cell w="w160"></Cell>
          <Cell w="w60"><SpanText size="sm">종류</SpanText></Cell>
          <Cell w="w100"><SpanText size="sm">학습형태</SpanText></Cell>
          <Cell w="w40"><SpanText size="sm">점수</SpanText></Cell>
        </Row>
        <Row
          v-for="(pair, idx) in sheets"
          :key="pair.paper.seq"
          :class="idx % 2 == 1 ? 'even' : 'odd'"
        >
          <Cell w="w160"
            ><SpanText size="sm">{{
              pair.section.chapter.desc
            }}</SpanText></Cell
          >
          <Cell w="w160"
            ><SpanText size="sm"
              >{{ pair.section.level === -1 ? "도전" : pair.section.level }}.
              {{
                pair.section.level === -1 ? "" : pair.section.description
              }}</SpanText
            ></Cell
          >
          <Cell w="w60"
            ><SpanText size="sm">{{ examType(pair.paper) }}</SpanText></Cell
          >
          <Cell w="w100"
            ><SpanText size="sm">{{ mode(pair.paper) }}</SpanText></Cell
          >
          <Cell w="w40"
            ><SpanText size="sm"
              ><button :class="{ anchor: pair.paper.mode === 'Q' }">
                {{ score(pair.paper) }}
              </button></SpanText
            ></Cell
          >
        </Row>
      </template>
    </TableView>
  </div>
</template>

<script>
import { ActionIcon } from "../../components/form";
import { TableView, Row, Cell } from "@/components/table";
import { shallowRef } from "vue";
import { SpanText } from "@/components/text";
import { useStore } from "vuex";

export default {
  components: {
    ActionIcon,
    SpanText,
    TableView,
    Row,
    Cell,
  },
  props: ["date", "papers"],
  setup(props) {
    const types = { W: "낱말", S: "문장", B: "교과서" };
    const modes = { L: "학습", Q: "퀴즈", R: "보고쓰기" };
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
    const score = (paper) => {
      const { mode } = paper;
      if (mode !== "Q") {
        return "---";
      }
      const corrects = paper.submissions.filter((submit) => submit.correct);
      const score = (100 * corrects.length) / paper.numOfQuestions;
      return score % 1 === 0 ? score : score.toFixed(1);
    };
    const initSheet = () => {
      const pairs = [];
      props.papers.forEach((paper) => {
        const section = store.getters["course/section"](paper.sectionRef);
        pairs.push({ paper, section });
      });
      sheets.value = pairs;
    };
    initSheet();
    return {
      sheets,
      examType,
      mode,
      score,
    };
  },
};
</script>

<style lang="scss" scoped>
.exam-table {
  flex: 1 1 auto;
  // margin: 16px;
  box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 3px 6px;
  border-radius: 8px;
  background-color: white;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-bottom: 8px;
  .head {
    display: flex;
    column-gap: 8px;
    font-size: 2rem;
    padding: 8px;
  }
  .table {
    overflow-y: auto;
    button {
      border: none;
      outline: none;
      background-color: transparent;
      &.anchor {
        text-decoration: underline;
        text-underline-offset: 2px;
        color: blue;
      }
    }
  }
}
</style>
