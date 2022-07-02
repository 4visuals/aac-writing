<template>
  <div class="trials">
    <TableView colsize="120px">
      <template v-slot:fcol>
        <Cell
          v-for="(q, idx) in ctx.questions"
          :key="q.index"
          :class="idx % 2 == 1 ? 'even' : 'odd'"
          w="w120"
        >
          <SpanText size="sm">{{ q.data.sentence }}</SpanText>
        </Cell>
      </template>
      <template v-slot:data>
        <Row
          v-for="(q, idx) in ctx.questions"
          :key="q.index"
          :class="idx % 2 == 1 ? 'even' : 'odd'"
        >
          <Cell
            v-for="(_, idx) in maxTrial"
            :key="idx"
            :class="answerClass(q, idx)"
            w="w80"
            ><SpanText class="text" size="sm">{{
              getTrialAt(q, idx)
            }}</SpanText></Cell
          >
        </Row>
      </template>
    </TableView>
  </div>
</template>

<script>
import { TableView, Row, Cell } from "@/components/table";
import { SpanText } from "@/components/text";
export default {
  components: {
    TableView,
    Row,
    Cell,
    SpanText,
  },
  props: ["ctx", "getTrialAt", "answerClass", "maxTrial"],
};
</script>

<style></style>
