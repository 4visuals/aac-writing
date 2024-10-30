<template>
  <div class="box">
    <button
      v-for="(chapter, index) in chapters"
      :key="chapter.seq"
      @click="setActiveChapter(chapter)"
      class="nude chapter-btn"
      :class="{ active: activeChapter === chapter }"
      :style="`--chapter-btn-color: ${scoreMap.chapters[index].webColor};`"
    >
      {{ chapter.desc.substring(0, 1) }}
    </button>
  </div>
  <div v-if="activeChapter" class="section">
    <!-- <button
      class="nude"
      :class="{ active: activeSection === undefined }"
      @click="setActiveSections(activeChapter.sections)"
    >
      전체
    </button> -->
    <button
      v-for="section in activeChapter.sections.filter((sec) => sec.level > 0)"
      :key="section.seq"
      @click="setActiveSections([section], section)"
      class="nude"
      :class="{
        active: activeSection === section,
        empty: !markMap.hasMark(section.level),
      }"
      :disabled="!markMap.hasMark(section.level)"
    >
      <span class="level">{{ section.level }}</span
      ><span class="desc">{{ section.description }}</span>
    </button>
  </div>
</template>

<script setup>
/**
 * course(가 ~ 차)별 조회 메뉴
 */
import { useStore } from "vuex";
import {
  computed,
  ref,
  defineEmits,
  defineProps,
  reactive,
  watch,
  onMounted,
} from "vue";
import { LevelScore, MarkMap } from "./level-score";
// import { LevelScore } from "./level-score.js";

/** @type { Readonly<{
    exams?: import('./exam-paper').StudentExamList ;
}>} */
const props = defineProps(["exams"]);
const emit = defineEmits({
  chart: Object,
});

const store = useStore();
const chapters = computed(() => store.getters["course/levels"]);
const scoreMap = LevelScore.getScoreList();
const markMap = MarkMap.buildMarkMap(scoreMap);

const activeChapter = ref(undefined);
const activeSection = ref(undefined);
/**
 * @type {{ exams?: import('./exam-paper').StudentExamList, sectionSet: Set<number>}}
 */
const chartData = reactive({
  exams: undefined,
  sectionSet: new Set(),
});

const BARCHART_OPTION = {
  // legend: { position: "bottom" },
  // axisTitlesPosition: "in",
  selectionMode: "single",
  dataOpacity: 1,
  fontSize: 10,
  chartArea: {},
  hAxis: {
    format: "M/d",
    title: null,
    textPosition: "out", // X축 아래에 날짜 표시
    viewWindow: null, // {min, max}
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
  vAxis: {
    minValue: 0,
    maxValue: 100,
    title: null,
    // viewWindowMode: "pretty",
    textPosition: "in",
    minorGridlines: {
      color: "#fff",
    },
    // ticks: [0, 20, 40, 60, 80, 100],
  },
};

const cols = [
  { id: "legend", type: "string", label: "Segments" },
  {
    id: "score",
    type: "number",
    label: "점수",
  },
  { id: "bar-style", type: "string", role: "style" },
  { id: "percent-text", type: "string", role: "annotation" },
];
const groupByLevels = () => {
  markMap.reset();
  const { exams } = chartData;
  const recent = exams.getRecentDate();
  const vs = exams.getValuesByMonth(recent, 12);
  vs.forEach(({ date, submissions }) => {
    markMap.flushSubmissions(date, submissions);
  });
};
/**
 */
const buildRows = () => {
  const { exams, sectionSet } = chartData;
  const chr = activeChapter.value.desc.substring(0, 1); // 가, 나, 다, ...
  const chapterScore = scoreMap.scores.find((score) => score.group === chr);
  /**
   * 1년치로 잘라낸 후 챕터별로 모두 뿌려줌
   */
  const recent = exams.getRecentDate();
  const vs = exams.getValuesByMonth(recent, 12);
  const rows = vs.map(({ date }) => {
    date.push(10, 0, 0); // 10:00:00
    const year = date[1] === 1 ? `${date[0]}년` : "";
    const month = { v: `${year}${date[1]}월` };
    const scoreData = { solved: 0, total: 0 };

    markMap
      .filterBy((marklet) => {
        return sectionSet.has(marklet.level) && marklet.isSameDate(date);
      })
      .reduce((data, mark) => {
        data.solved += mark.solved;
        data.total += mark.total;
        return data;
      }, scoreData);
    const value =
      scoreData.total === 0 ? null : (scoreData.solved / scoreData.total) * 100;
    const score = {
      v: value || 0,
    };
    const style = { v: `color: ${chapterScore.webColor}; font-size: 12px;` };
    const annotation = {
      v: value !== null ? `${value.toFixed(1)}%` : "없음",
    };
    return { c: [month, score, style, annotation] };
  });
  return rows;
};
const resolveChartTile = () => {
  if (activeSection.value) {
    const { level, description } = activeSection.value;
    return `${level}. ${description}`;
  } else {
    return activeChapter.value.desc;
  }
};
const setActiveSections = (sections, selectedSection) => {
  const { sectionSet } = chartData;
  sectionSet.clear();
  sections.reduce((set, section) => {
    set.add(section.level);
    return set;
  }, sectionSet);
  // 종합평가는 제외함
  sectionSet.delete(-1);
  activeSection.value = selectedSection;
  const rows = buildRows();

  const chartOption = Object.assign({}, BARCHART_OPTION);
  chartOption.title = resolveChartTile();
  const eventName = selectedSection ? "sectionChart" : "chart";
  emit(eventName, { activeSection, chartOption, cols, rows });
};
const setActiveChapter = (chapter) => {
  activeChapter.value = chapter;
  setActiveSections(chapter.sections, undefined);
};
watch(
  () => props.exams,
  (exams) => {
    chartData.exams = exams;
    groupByLevels();
    setActiveChapter(activeChapter.value);
  }
);
onMounted(() => {
  chartData.exams = props.exams;
  groupByLevels();
});
</script>

<style lang="scss" scoped>
.box {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  margin: 8px 2px;
  padding: 6px;
  box-shadow: 0 0 4px #0000004d;
  border-radius: 8px;
  gap: 2px;
  .nude {
    color: var(--chapter-btn-color);
    border-radius: 6px;
    border: 1px solid;
    &.active {
      color: white;
      background-color: var(--chapter-btn-color);
    }
  }
}
.section {
  display: flex;
  flex-direction: column;
  row-gap: 4px;
  margin: 0 2px;
  .nude {
    width: 100%;
    font-weight: 400;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
    border-radius: 8px;
    &.active {
      color: white;
      background-color: #0038bc;
      outline: 2px solid #0038bc4d;
    }
    &:hover {
      outline: 2px solid #0038bc4d;
    }
    &:active {
      transform: translate(1px, 1px);
    }
    &.emity {
      color: #777;
      background-color: #ececec;
    }
    .desc {
      white-space: nowrap;
    }
  }
}
</style>
