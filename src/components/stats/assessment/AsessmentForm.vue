<template>
  <div :class="ready ? 'show-chart' : 'no-chart'">
    <ul v-if="questions">
      <li>
        <h4 :class="{ list: ready }">{{ title }}</h4>
      </li>
      <li v-for="q in questions" :key="q.seq">
        <input
          type="text"
          :class="`q ${q?.answer?.answer ? 'has' : ''}`"
          :readonly="ready"
          :placeholder="q.question"
          :value="q.answer ? q.answer.answer : ''"
          @blur="
            (e) =>
              !ready &&
              $emit('answer', { type, quiz: q, answer: e.target.value })
          "
        />
      </li>
    </ul>
    <div v-if="ready" class="chart">
      <GoogleBarChart :chartFormat="chartData" />
    </div>
    <div v-else class="commit">
      <AppButton
        text="작성완료"
        :disabled="!answerAllfilled"
        @click="$emit('commit', { type })"
      />
    </div>
  </div>
</template>

<script setup>
import GoogleBarChart from "../GoogleBarChart.vue";
import { computed, defineProps, reactive, ref, watch } from "vue";
import { LevelScore } from "./level-score.js";
import { AppButton } from "../../form";

const props = defineProps(["type", "diagnosis"]);

const questions = computed(() => props.diagnosis.questions);
const ready = computed(() => props.diagnosis.ready);
const title = computed(() =>
  props.type === "before" ? "진단평가" : "종합평가"
);
const answerAllfilled = ref(false);
const chartData = reactive({
  option: { title: "날짜별" },
  area: { width: 600, height: 400 },
  data: {
    cols: [
      { id: "legend", type: "string", label: "Segments" },
      {
        id: "score",
        type: "number",
        label: "점수",
      },
      { id: "bar-style", type: "string", role: "style" },
      { id: "percent-text", type: "string", role: "annotation" },
    ],
    rows: undefined,
  },
});
const scoreMap = LevelScore.getScoreList();
const prepareChart = () => {
  // const { questions } = props;
  /**
   * marks: [
   *   {L01: [2, 5], L17: [3, 10], ...},
   *   {L01: [8, 8], L05: [3, 4], ...},
   * ]
   */
  scoreMap.reset();
  const marks = questions.value.map((q) => q.answer.analysis);
  marks.forEach((mark) => {
    Object.keys(mark).forEach((Lxx) => {
      const lvl = parseInt(Lxx.substring(1));
      const solved = mark[Lxx][0];
      const total = mark[Lxx][1];
      for (let k = 0; k < scoreMap.length; k++) {
        const score = scoreMap.at(k);
        if (lvl < score.level) {
          score.solved += solved;
          score.total += total;
          break;
        }
      }
    });
  });
  const rows = scoreMap.scores.map((score) => {
    const column = { v: [score.group] };
    const value = {
      v: score.getPercent(),
    };
    const style = { v: `color: ${score.webColor}; font-size: 12px;` };
    const annotation = { v: `${score.getPercent()}%` };
    return { c: [column, value, style, annotation] };
  });
  if (ready.value) {
    chartData.data.rows = rows;
  }
};
watch(
  questions,
  (questions) => {
    if (!questions) {
      return;
    }
    const answers = questions.filter((q) => !!q.answer).map((q) => q.answer);
    answerAllfilled.value = answers.length === questions.length;
    if (ready.value) {
      prepareChart();
    }
  },
  { deep: true, immediate: true }
);
watch(ready, (ready) => {
  if (ready) {
    prepareChart();
  }
});
</script>

<style lang="scss" scoped>
ul {
  margin: 0 auto;
  list-style: none;
  padding-left: 0;
  max-width: 600px;
  text-align: left;
  display: flex;
  flex-direction: column;
  row-gap: 4px;
  li {
    display: flex;
    align-items: center;
    font-size: 1.5rem;
    h4 {
      width: 100%;
      display: flex;
      justify-content: center;
      font-family: "NanumSquareRound", "Noto Sans KR", sans-serif;
      font-size: 2.5rem;
      font-weight: 600;
      margin: 16px 0;
      &.list {
        font-size: 1.6rem;
        margin: 8px 0 0;
        justify-content: flex-start;
      }
    }
    .q {
      flex: 1 1 auto;
      padding: 6px 12px;
      border: 1px solid #777;
      border-radius: 4px;
      color: #777;
      outline: none;
      font-weight: 600;
      font-family: "Nanum Gothic", "Noto Sans KR", Avenir, Helvetica, Arial,
        sans-serif;
      &::placeholder {
        font-weight: 400;
      }
      &.has {
        border-color: #4b7bec;
        color: #4b7bec;
        &:focus {
          background-color: #d2ecfd;
          outline: 2px solid #4b7bec4d;
        }
      }
    }
  }
}
.commit {
  display: flex;
  justify-content: center;
  margin: 8px auto;
}
.show-chart {
  display: flex;
  column-gap: 8px;
  ul {
    flex: 0 0 25%;
  }
  .chart {
    flex: 0 0 75%;
    display: flex;
    flex-direction: column;
  }
}
</style>
