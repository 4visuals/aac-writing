<template>
  <div class="box">
    <div class="year-form">
      <ActionIcon icon="arrow_left" fsize="22px" />
      <span>{{ year }}</span>
      <ActionIcon icon="arrow_right" fsize="22px" />
    </div>
    <div class="month-form">
      <button
        v-for="m in monthes"
        :key="m"
        @click="setActiveMonth(m)"
        class="nude"
        :class="{ active: activeMonth === m }"
      >
        {{ m }}월
      </button>
    </div>
  </div>
</template>

<script setup>
import ActionIcon from "@/components/form/ActionIcon.vue";
import { reactive, ref, defineEmits, defineProps, watch } from "vue";
import { LevelScore } from "./level-score.js";
import { useStore } from "vuex";
/** @type { Readonly<{
    exams?: import('./exam-paper').StudentExamList ;
}>} */
const props = defineProps(["exams"]);
const emits = defineEmits(["chart"]);
const store = useStore();
const findSection = store.getters["course/section"];

/**
 * @type {{ exams?: import('./exam-paper').StudentExamList}}
 */
const chartData = reactive({
  exams: undefined,
});
const current = new Date();
const year = ref(current.getFullYear());
const monthes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const scoreMap = LevelScore.getScoreList();

const activeMonth = ref(undefined);
const getDateRange = (year, month) => {
  const start = new Date(year, month - 1, 1, 0, 0, 0, 0);
  const end = new Date(start);
  end.setMonth(month);
  return [start, end];
};
const flushChart = () => {
  const cols = [
    { id: "legend", label: "Segments", type: "string" },
    {
      id: "score",
      label: "점수",
      type: "number",
    },
  ];
  scoreMap.reset();
  const mapByChaterName = chartData.exams.getValueByChapter(
    scoreMap,
    (sectionSeq) => findSection(sectionSeq)
  );
  console.log(mapByChaterName);
  const rows = scoreMap.scores.map((score) => {
    const submissions = mapByChaterName.get(score.group);
    if (submissions) {
      submissions.reduce((score, sbm) => {
        Object.values(sbm.analysis).forEach(([solved, total]) => {
          score.solved += solved;
          score.total += total;
        });
        return score;
      }, score);
    }
    return {
      c: [{ v: score.group }, { v: score.getPercent() }],
    };
  });
  console.log(cols, rows);
  emits("chart", { cols, rows });
};
const setActiveMonth = (month) => {
  activeMonth.value = month;
  const { exams } = props;
  const [start, end] = getDateRange(year.value, month).map((date) =>
    date.getTime()
  );
  const courseExam = exams.mapBy((paper) => {
    const millis = paper.startTime.getTime();
    return start <= millis && millis < end;
  });
  chartData.exams = courseExam;
  flushChart();
};
watch(
  () => props.exams,
  (exams) => {
    console.log("[student changed]", exams);
    year.value = exams.getRecentDate().getFullYear();
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.year-form {
  display: flex;
  align-items: center;
  justify-content: center;
}
.box {
  margin: 8px 0;
  box-shadow: 0 0 4px #0000004d;
  border-radius: 8px;
  padding: 6px;
  .month-form {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    .nude {
      color: #777;
      border-radius: 6px;
      &.active {
        color: white;
        background-color: #0038bc;
      }
    }
  }
}
</style>
