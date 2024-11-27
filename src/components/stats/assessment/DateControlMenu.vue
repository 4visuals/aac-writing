<template>
  <div class="box">
    <div class="year-form">
      <ActionIcon icon="arrow_left" fsize="22px" @click="shiftYear(-1)" />
      <span>{{ year }}</span>
      <ActionIcon icon="arrow_right" fsize="22px" @click="shiftYear(+1)" />
    </div>
    <div class="month-form">
      <button
        v-for="m in monthes"
        :key="m"
        @click="setActiveMonth(m)"
        class="nude"
        :class="{
          active: activeMonth === m,
          empty: !markMap.hasMarkByDate(year, m),
        }"
        :disabled="!markMap.hasMarkByDate(year, m)"
      >
        {{ m }}월
      </button>
    </div>
  </div>
  <div v-if="!activeMonth" class="guide">선택된 월이 없습니다.</div>
</template>

<script setup>
import ActionIcon from "@/components/form/ActionIcon.vue";
import { reactive, ref, defineEmits, defineProps, watch, onMounted } from "vue";
import { LevelScore, MarkMap } from "./level-score.js";
/** @type { Readonly<{
    exams?: import('./exam-paper').StudentExamList ;
}>} */
const props = defineProps(["exams"]);
const emits = defineEmits(["chart"]);

const BARCHART_OPTION = {
  selectionMode: "single",
  dataOpacity: 1,
  fontSize: 10,
  chartArea: {},
  hAxis: {
    format: "M/d",
    title: null,
    textPosition: "out",
    viewWindow: null,
    minorGridlines: {
      color: "#fff",
    },
  },
  interpolateNulls: true,

  pointSize: 8,
  slantedText: true,
  theme: "material",
  tooltip: {
    isHtml: true,
    textStyle: { color: "#444" },
    showColorCode: true,
    trigger: "focus", // "selection",
  },
  annotations: {
    textStyle: {
      fontSize: 16,
      color: "#444", // The color of the text.
      auraColor: "#fff", // The color of the text outline.
      opacity: 1, // The transparency of the text.
    },
  },
  vAxis: {
    minValue: 0,
    maxValue: 100,
    title: null,
    // viewWindowMode: "pretty",
    textPosition: "in",
    minorGridlines: {
      color: "#fff",
    },
    ticks: [0, 20, 40, 60, 80, 100],
  },
};

/**
 * @type {{ exams?: import('./exam-paper').StudentExamList}}
 */
const chartData = reactive({
  exams: undefined,
});
const cols = [
  { id: "legend", label: "Segments", type: "string" },
  {
    id: "score",
    label: "점수",
    type: "number",
  },
  { id: "bar-style", type: "string", role: "style" },
  { id: "percent-text", type: "string", role: "annotation" },
];
// const current = new Date();
const year = ref(0);
const activeMonth = ref(undefined);
const monthes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const scoreMap = LevelScore.getScoreList();
const markMap = MarkMap.buildMarkMap(scoreMap);
/**
 * chapter별 score
 * @type {Record<number, Marklet[]>} key(chapter index)
 */
let marksByScore = {};
const getDateRange = (year, month) => {
  const start = new Date(year, month - 1, 1, 0, 0, 0, 0);
  const end = new Date(start);
  end.setMonth(month);
  return [start, end];
};

const flushChart = () => {
  scoreMap.reset();
  marksByScore = {};
  const current = [year.value, activeMonth.value, undefined];

  // '가' ~ '차' 까지 데이터 생성함
  const rows = scoreMap.scores.map((score) => {
    const marklets = markMap.filterBy(
      (marklet) =>
        marklet.chapterRef === score.index && marklet.isSameDate(current)
    );
    if (marklets && marklets.length > 0) {
      marklets.forEach((marklet) => {
        score.solved += marklet.solved;
        score.total += marklet.total;
      });
    }
    marksByScore[score.index] = marklets;
    const group = { v: score.group };
    const score2 = {
      v: score.getPercent(),
      p: { group: score.group, chater: score.index },
    };
    const style = { v: `color: ${score.webColor}; font-size: 12px;` };
    const annotation = {
      v: score.isEmpty()
        ? "없음"
        : `${score2.v}%\n(${score.solved}/${score.total})`,
    };
    return {
      c: [group, score2, style, annotation],
    };
  });
  const chartOption = Object.assign({}, BARCHART_OPTION);
  chartOption.title = `${year.value}년 ${activeMonth.value}월`;
  emits("chart", { chartOption, cols, rows, marksMap: marksByScore });
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
/**
 * 주어진 연도의 marklet을 수집함(yyyy년 1월부터 12월까지 모두 수집)
 * @param {import('./exam-paper.js').StudentExamList} exams
 */
const prepareMarkMap = (exams) => {
  markMap.reset();
  exams.papers
    .filter((paper) => {
      const y = paper.startTime.getFullYear();
      return year.value === y;
    })
    .forEach((paper) => {
      const { submissions, startTime } = paper;
      const time = [
        startTime.getFullYear(),
        startTime.getMonth() + 1,
        startTime.getDate(),
      ];
      markMap.flushSubmissions(time, submissions);
    });
};
const shiftYear = (delta) => {
  const y = year.value;
  year.value = y + delta;
  activeMonth.value = undefined;
  prepareMarkMap(props.exams);
};
const examChanged = (renderChart) => {
  const { exams } = props;
  if (exams) {
    if (exams.papers.length > 0) {
      year.value = exams.getRecentDate().getFullYear();
      activeMonth.value = undefined;
      prepareMarkMap(exams);
      if (renderChart) {
        setActiveMonth(activeMonth.value);
      }
    } else {
      year.value = new Date().getFullYear();
    }
  }
};
watch(
  () => props.exams,
  () => examChanged(false)
);
onMounted(() => {
  examChanged(false);
});
</script>

<style lang="scss" scoped>
.year-form {
  display: flex;
  align-items: center;
  justify-content: center;
}
.box {
  margin: 8px 4px;
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
      &.empty {
        color: #ddd;
      }
    }
  }
}
</style>
