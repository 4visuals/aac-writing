<template>
  <div class="trials">
    <div class="sen" v-for="q in ctx.questions" :key="q.index">
      <p>
        <SpanText>{{ q.text }}</SpanText>
      </p>
      <TableView colsize="0px" fitBy="row">
        <template v-slot:fcol>&nbsp;</template>
        <template v-slot:data>
          <template v-if="ctx.isLearningMode()">
            <!-- <Row>
              <Cell v-for="ej in q.eojeols" :key="ej.seq" w="w100"
                ><SpanText>{{ ej.text }}</SpanText></Cell
              >
            </Row> -->
            <Row class="trials"
              ><Cell
                class="eojeols"
                v-for="ej in q.eojeols"
                :key="ej.seq"
                nowrap
                w="w100"
                ><SpanText
                  class="trial"
                  :class="trial.correct ? 'correct' : 'failed'"
                  v-for="(trial, idx) in ej.trials"
                  :key="idx"
                  >{{ trial.value }}</SpanText
                ><SpanText class="trial none" v-if="ej.trials.length === 0"
                  >미입력</SpanText
                ></Cell
              >
            </Row>
          </template>
          <template v-else-if="ctx.isQuizMode()">
            <Row class="trials" v-for="(jd, idx) in judge(q.trials)" :key="idx"
              ><SpanText
                class="trial"
                :class="jd.correct ? 'correct' : 'failed'"
                ><span class="icon material-icons-outlined" v-if="jd.correct"
                  >thumb_up_alt </span
                ><span class="icon material-icons-outlined" v-else
                  >thumb_down_alt </span
                ><span>{{ jd.value }}</span></SpanText
              ></Row
            >
            <Row class="trials" v-if="q.trials.length === 0"
              ><SpanText class="trial none"><span>미입력</span></SpanText></Row
            >
          </template>
        </template>
      </TableView>
    </div>
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
  setup() {
    const judge = (trials) => trials;
    return {
      judge,
    };
  },
};
</script>

<style lang="scss" scoped>
.trials {
  .sen {
    margin: 0 16px 8px;
    .trials {
      .eojeols {
        display: flex;
        flex-direction: column;
        padding: 0;
        margin-right: 4px;
      }
      .trial {
        padding: 0.25rem 0.5rem;
        font-size: 1.15rem;
        display: inline-flex;
        align-items: center;
        column-gap: 8px;
        border-left: 2px solid transparent;
        padding: 0.25rem 0.5rem;
        .icon {
          font-size: 1.4rem;
        }
        &.none {
          background-color: #efefefa3;
          color: #9c9c9c;
          border-color: #efefefa3;
        }
        &.correct {
          background-color: #bef1ffa1;
          color: #144e7d;
          border-color: #144e7d;
        }
        &.failed {
          background-color: #e8e8e8a3;
          color: #535353;
          border-color: #535353;
        }
      }
    }
  }
}
</style>
