<template>
  <div class="stat" ref="chartEl">
    <div class="control">
      <TabView :model="tabModel" />
      <div class="tab-body">
        <div v-if="activeTab.cmd === 'level'">
          <CourseControlMenu
            :exams="exams"
            @chart="(e) => showChart(e, chartData)"
            @sectionChart="(e) => showChart(e, detailChart)"
          />
        </div>
        <div v-else-if="activeTab.cmd === 'date'">
          <DateControlMenu
            :exams="exams"
            @chart="(e) => showChart(e, chartData)"
          />
        </div>
      </div>
    </div>
    <div class="chart">
      <div class="half">
        <GoogleBarChart
          v-if="chartData.visible"
          :chartOption="chartData.option"
          :chartFormat="chartData"
          @select="showDetailChart"
        />
      </div>
      <div class="half" :key="detailChart.data.rows">
        <GoogleBarChart
          v-if="detailChart.visible"
          :chartFormat="detailChart"
          :chartOption="detailChart.option"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { TabModel, TabView } from "@/components/tab";
import CourseControlMenu from "./CourseControlMenu.vue";
import DateControlMenu from "./DateControlMenu.vue";
import GoogleBarChart from "../GoogleBarChart.vue";
import {
  reactive,
  defineProps,
  watch,
  onMounted,
  shallowRef,
  onUnmounted,
} from "vue";
import { useStore } from "vuex";
import { arr } from "@/service/util";
import { LevelScore } from "./level-score";

const props = defineProps(["exams"]);
const store = useStore();
const chapters = store.getters["course/levels"];
const tabModel = TabModel.create([
  { text: "단계별", cmd: "level", clazz: "level" },
  { text: "날짜별", cmd: "date", clazz: "date" },
]);
const { activeTab } = tabModel;
// const visible = ref(false);

const scoreMap = LevelScore.getScoreList();

// const chartOption = shallowRef(undefined);
const chartData = reactive({
  visible: false,
  option: { title: "날짜별" },
  area: { width: 600, height: 400 },
  data: { cols: undefined, rows: undefined },
});

const detailChart = reactive({
  visible: false,
  marklets: undefined,
  option: {
    title: "챕터별",
    vAxis: {
      minValue: 0,
      maxValue: 100,
      title: null,
      textPosition: "out",
      minorGridlines: {
        color: "#fff",
      },
    },
  },
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
/**
 * ddd
 * @param {{
 *  rows: {c: {v: any[]}[]}[],
 *  cols: {id:string, label: string, type: string}[],
 *  marksMap: Record<number, Marklet[]>
 * }} e
 */
const showChart = (e, chartData) => {
  const { rows, cols, marksMap } = e;
  // chartOption.value = e.chartOption;
  chartData.option = e.chartOption;
  chartData.data.cols = cols;
  chartData.data.rows = rows;
  if (marksMap) {
    detailChart.marklets = marksMap;
  }
  detailChart.visible = false;
  chartData.visible = false;
  setTimeout(() => {
    chartData.visible = true;
  });
};
const redrawChart = () => {
  if (chartData.visible) {
    chartData.visible = false;
    setTimeout(() => {
      chartData.visible = true;
    });
  }
  if (detailChart.visible) {
    detailChart.visible = false;
    setTimeout(() => {
      detailChart.visible = true;
    });
  }
};
/**
 *
 * @param {{chater: number, group: string}} e (chapter: index of chapters, group: 가, 나, 다, ..)
 */
const showDetailChart = (e) => {
  const { chater: index } = e;
  const { marklets } = detailChart;
  if (marklets && marklets[index]) {
    const marks = marklets[index]
      .filter((mklet) => mklet.chapterRef === e.chater)
      .map((mklet) => mklet.mark);

    const map = arr.groupByMap(
      marks,
      (mark) => mark[0],
      () => ({ solved: 0, total: 0 }),
      (elem, mark) => {
        elem.solved += mark[1][0];
        elem.total += mark[1][1];
      }
    );
    const chapter = chapters[index];
    const { group } = e;
    const chapterScore = scoreMap.scores.find((score) => score.group === group);
    chapterScore.forEachLevel((_, label) => {
      if (!map.has(label)) {
        map.set(label, { solved: 0, total: 0 });
      }
    });
    const chartValues = [...map.entries()].sort((a, b) =>
      a[0].localeCompare(b[0])
    );
    const rows = chartValues.map(([lvlName, score]) => {
      const level = parseInt(lvlName.substring(1));
      const { solved, total } = score;
      const column = { v: lvlName };
      const percentage = (total ? solved / total : 0) * 100;
      const value = {
        v: percentage,
        p: { level, score: { solved, total } },
      };
      const style = { v: `color: ${chapterScore.webColor}; font-size: 12px;` };

      const annoText = total ? `${percentage.toFixed(0)}%` : "없음";
      const annotation = { v: annoText };

      const section = chapter.sections.find(
        (section) => section.level === level
      );
      const { description } = section;
      const tooltipText = { v: `${description} - ${annoText}` };

      return { c: [column, value, style, annotation, tooltipText] };
    });
    detailChart.visible = true;
    detailChart.option.title = chapter.desc;
    detailChart.data.rows = rows;
  }
};
watch(
  () => props.exams,
  (exams) => {
    console.log("[exam]", exams);
  }
);
watch(activeTab, () => {
  chartData.visible = false;
  detailChart.visible = false;
});
let chartEl = shallowRef(null);
let resizer;
let timer;
const debouncing = () => {
  clearTimeout(timer);
  timer = setTimeout(redrawChart, 200);
};
onMounted(() => {
  resizer = new ResizeObserver(debouncing);
  resizer.observe(chartEl.value);
});
onUnmounted(() => {
  resizer.disconnect();
});
</script>

<style lang="scss" scoped>
.stat {
  display: flex;
  column-gap: 8px;
  height: 100%;
  overflow: hidden;
  .control {
    flex: 0 0 200px;
    width: 200px;
    .by-type {
      display: flex;
      column-gap: 8px;
      button.nude {
        flex: 1 1 50%;
        width: 50%;
        &:active {
          transform: translate(1px 1px);
        }
        &.level {
          background-color: rgba(0, 75, 215, 0.731);
          color: white;
        }
        &.date {
          background-color: rgb(0, 191, 19);
          color: white;
        }
      }
    }
  }
  .chart {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    .half {
      height: 50%;
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
