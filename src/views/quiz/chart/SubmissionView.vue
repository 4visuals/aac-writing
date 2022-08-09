<template>
  <div class="submissions">
    <TableView class="exams" colsize="120px" :columnBased="true">
      <template v-slot:fcol>
        <Cell
          v-for="(sen, idx) in sentences"
          :key="sen.index"
          :class="idx % 2 == 0 ? 'even' : 'odd'"
          w="inline"
          nowrap
          ><SpanText size="sm">{{ sen.sentence }}</SpanText></Cell
        >
      </template>
      <template v-slot:data>
        <Col class="exam" v-for="(exam, idx) in exams" :key="idx">
          <Cell
            v-for="(sbm, idx) in exam.submissions"
            :key="idx"
            :class="{
              even: idx % 2 === 0,
              odd: idx % 2 === 1,
              correct: sbm.correct,
              empty: !sbm.value,
            }"
            nowrap
            w="inline"
            ><SpanText size="sm">{{ sbm.value || "미입력" }}</SpanText></Cell
          ></Col
        >
      </template>
    </TableView>
  </div>
</template>

<script>
import { TableView, Col, Cell } from "@/components/table";
import { SpanText } from "@/components/text";

export default {
  components: {
    TableView,
    Col,
    Cell,
    SpanText,
  },
  props: ["sentences", "exams"],
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.submissions {
  padding: 16px;
  .exams {
    display: flex;
    column-gap: 4px;
    .exam {
      .correct {
        color: #27600c;
        background-color: #ccff98;
      }
      .empty {
        font-size: 0.9em;
        color: #999;
        font-style: italic;
      }
    }
  }
}
</style>
