<template>
  <div class="chart-wrapper">
    <div class="legend">
      <SegmentView
        @active-segment="setActiveSegment"
        :resourceType="ctx.resourceType"
        :toggling="true"
      />
    </div>
    <div class="chart" ref="chartEl"></div>
    <div
      v-if="chartEvent.active"
      class="custom-tooltip"
      :class="{ h80: ctx.isSentence() && ctx.mode !== 'QUIZ' }"
    >
      <h3 class="head">
        <ActionIcon icon="arrow_back_ios" @click="closeSubmissionView" />
        <span>{{ section.description }}</span>
      </h3>
      <div class="stats">
        <ParaText
          ><span>{{ chartEvent.stats.date }}</span
          >(<span>{{ chartEvent.stats.range }}번</span>)</ParaText
        >
        <ParaText :small="true"
          ><span class="score"
            >최종 {{ chartEvent.stats.score.toFixed(1) }}점</span
          ><span class="cnt"
            >전체: {{ chartEvent.stats.total }}, 정답:
            {{ chartEvent.stats.correct }}</span
          ></ParaText
        >
      </div>
      <div class="scrollable">
        <EojeolSubmissionStackView
          :sentences="chartEvent.sentences"
          :papers="chartEvent.exams"
          v-if="ctx.isSentence() && ctx.mode !== 'QUIZ'"
        />
        <SentenceSubmissionStackView
          :sentences="chartEvent.sentences"
          :papers="chartEvent.exams"
          v-else
        />
      </div>
    </div>
    <div class="empty-chart" v-if="chart.rows && chart.rows.length === 0">
      데이터 없음
    </div>
  </div>
</template>

<script>
import { ParaText } from "@/components/text";
import { ActionIcon } from "@/components/form";
import api from "@/service/api";
import { time } from "@/service/util";
import { onMounted, onUnmounted, ref, shallowRef } from "vue";
import { useStore } from "vuex";
// import SubmissionView from "./SubmissionView.vue";
import SegmentView from "@/components/quiz/SegmentView.vue";
import EojeolSubmissionStackView from "../../../components/quiz/submission/EojeolSubmissionStackView.vue";
import SentenceSubmissionStackView from "../../../components/quiz/submission/SentenceSubmissionStackView.vue";
import countAnswer from "@/components/stats/count-answer";
const colors = [
  "#f3a600",
  "#00acc2",
  "#c2ac88",
  "#5e97f6",
  "#db4537",
  "#0e9d59",
  "#444444",
];
const options = {
  // animation: {
  //   duration: 300,
  //   easing: "linear",
  //   startup: true,
  // },
  legend: { position: "none" },
  axisTitlesPosition: "in",
  aggregationTarget: "series",
  selectionMode: "single", // ["single", "multiple"], // 여러개의 legend를 활성화할 것인지
  dataOpacity: 1,
  fontSize: 10,
  colors,
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
  series: {
    0: { lineWidth: 4 },
    1: { lineWidth: 4 },
    2: { lineWidth: 4 },
    3: { lineWidth: 4 },
    4: { lineWidth: 4 },
    5: { lineWidth: 4 },
    6: { lineWidth: 4 },
    7: { lineWidth: 4 },
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

  // height: 500,
};

export default {
  components: {
    ActionIcon,
    EojeolSubmissionStackView,
    SentenceSubmissionStackView,
    // SubmissionView,
    ParaText,
    SegmentView,
  },
  setup() {
    const chartEl = ref(null);
    const chart = shallowRef({});
    const EVENT_TEMPLATE = {
      type: null,
      active: false,
      event: null,
      select: null,
      sentences: null,
      exams: [],
      stats: {
        date: null,
        range: null,
        correct: 0,
        total: 0,
        score: 0,
      },
    };
    const chartEvent = ref(Object.assign({}, EVENT_TEMPLATE));
    const store = useStore();
    const ctx = store.state.quiz.quizContext;
    const type = ctx.getQuestionType(); // 'W'|'S'
    const findSection = store.getters["course/section"];
    const section = findSection(ctx.sectionSeq);
    const sentences = section.sentences.filter((sen) => sen.type === type);
    const segments = ctx.getSegments(type);
    const activeSegment = ref(null);
    let resizer;

    const hideColumns = (chart, indexes) => {
      const { vmodel, columnIndexes } = chart;
      if (indexes) {
        vmodel.hideColumns(indexes);
      } else {
        vmodel.setColumns(columnIndexes);
      }
      // view.draw(vmodel, chartOption);
      renderChart();
    };
    const closeSubmissionView = () => {
      chartEvent.value = Object.assign({}, EVENT_TEMPLATE);
      chart.value.view.setSelection();
    };
    const createTableRows = (ymdMap, segments, stats) => {
      // const rowMap = new Map();
      for (let ymd of ymdMap.keys()) {
        const scores = segments.flatMap((seg, index) => {
          const exams = stats.filter(
            (stat) =>
              stat.ymd === ymd &&
              stat.questionOffset === seg.offset &&
              stat.numOfQuestions === seg.size
          );
          if (exams.length === 0) {
            return [null, `color: ${colors[index]}`];
          }
          const acc = exams.reduce(
            (acc, exam) => {
              // 마지막 점수만 차트에 찍어줌
              acc.total = exam.total;
              acc.correct = exam.correct;
              return acc;
            },
            { total: 0, correct: 0 }
          );
          const score = (100 * acc.correct) / acc.total;
          return [score, `color: ${colors[index]}`];
        });
        const row = ymdMap.get(ymd);
        row.push(...scores);
      }
      return [...ymdMap.values()];
    };
    const setActiveSegment = (segment) => {
      // const active = toRaw(activeSegment.value);
      if (!chart.value.vmodel) {
        // 아직 차트 준비 안됨
        return;
      }
      if (!segment) {
        activeSegment.value = null;
        hideColumns(chart.value, null);
      } else {
        activeSegment.value = segment;
        const colIndex = 1 + 2 * segment.index;
        const cols = [0, colIndex, colIndex + 1];
        const { vmodel } = chart.value;
        vmodel.setColumns(cols);
        renderChart();
      }
    };
    const installListener = (chart) => {
      const { view } = chart;
      google.visualization.events.addListener(view, "click", (e) => {
        console.log("[click]", e);
        const { targetID } = e;
        if (targetID === "chartarea") {
          // hideColumns(chart, null);
          closeSubmissionView();
        } else if (targetID.startsWith("point")) {
          chartEvent.value.click = e;
          // chartEvent.value.active = true;
          chartEvent.value.type = "point";
        } else {
          // closeSubmissionView();
        }
      });
      google.visualization.events.addListener(view, "select", () => {
        const s = view.getSelection();
        // const v = chart.getValue()
        console.log("[select]", s);
        if (s.length === 0) {
          // 현재 눌린 point를 또 누름
          return;
        }

        if (chartEvent.value.type === "point") {
          // if (!chartEvent.value.active) {
          //   return;
          // }
          chartEvent.value.select = s[0];
          const { row, column } = s[0];
          const rowData = chart.rows[row]; // ['2022-09-01', 23, 45, 11]
          const date = rowData[0];

          const realColumn = chart.vmodel.getTableColumnIndex(column);
          const { offset, size } = segments[(realColumn - 1) / 2];
          const exams = chart.stats.filter(
            (stat) =>
              stat.ymd === date.ymd &&
              stat.questionOffset === offset &&
              stat.numOfQuestions === size
          );
          const stats = exams.reduce(
            (acc, exam) => {
              acc.total += exam.total;
              acc.correct += exam.correct;
              return acc;
            },
            { total: 0, correct: 0, score: 0 }
          );
          const lastExam = exams[exams.length - 1];
          stats.score = (100 * lastExam.correct) / lastExam.total;
          stats.date = date.ymd;
          stats.range = `${offset + 1} ~ ${offset + 10}`;

          chartEvent.value.stats = stats;
          chartEvent.value.active = true;
          chartEvent.value.exams = exams;
          chartEvent.value.sentences = sentences.slice(offset, offset + size);
        }
      });
    };
    const loadData = () => {
      // let type = ctx.resourceType;
      // type = type === "A" ? "S" : type;
      const mode = ctx.mode.substring(0, 1);
      return api.exam
        .answers(ctx.sectionSeq, mode, type, ctx.license.uuid)
        .then((res) => {
          const stats = res.papers
            .filter((paper) => paper.mode === mode)
            .map((paper) => {
              const total = paper.numOfQuestions; // paper.submissions.length;
              const corrects = countAnswer(paper, section);
              const failed = total - corrects.length;
              const ymd = time.toYMD(paper.startTime);
              return { ...paper, total, correct: corrects.length, failed, ymd };
            });
          return stats;
        });
    };

    const renderChart = () => {
      // 1. 영억 지정
      const { offsetWidth } = chartEl.value;
      const { vmodel, chartOption, view, rows } = chart.value;
      chartOption.chartArea.left = 20;
      chartOption.chartArea.top = 20;
      chartOption.chartArea.width = offsetWidth - 40;
      chartOption.chartArea.height = 500;
      // if (!chartOption.hAxis.viewWindow) {

      // }
      const min = rows.length > 0 ? rows[0][0] : new Date();
      const max = rows.length > 0 ? rows[rows.length - 1][0] : new Date();
      chartOption.hAxis.viewWindow = {
        min,
        max,
      };
      if (!chartOption.hAxis.ticks) {
        const ticks = rows.map((row) => row[0]);
        chartOption.hAxis.ticks = ticks;
      }
      view.draw(vmodel, chartOption);
    };
    let timer = null;
    const debouncing = () => {
      clearTimeout(timer);
      timer = setTimeout(renderChart, 300);
    };
    const buildChart = (stats) => {
      // 1. define columns
      const model = new google.visualization.DataTable();
      model.addColumn("date", "Date");
      segments.forEach((seg) => {
        model.addColumn("number", `${seg.offset + 1}~${seg.offset + 10}`);
        model.addColumn({ type: "string", role: "style" });
      });

      // 2. define series
      const ymdMap = stats
        .map((stat) => [stat.ymd])
        .reduce((map, row) => {
          map.set(row[0], row);
          return map;
        }, new Map());
      const rows = createTableRows(ymdMap, segments, stats);
      rows.forEach((row) => {
        const ymd = row[0];
        const [y, m, d] = ymd.split("-").map((s) => parseInt(s));
        row[0] = new Date(y, m - 1, d);
        row[0].ymd = ymd;
      });
      model.addRows(rows);

      const vmodel = new google.visualization.DataView(model);
      const view = new google.visualization.LineChart(chartEl.value);
      // view.draw(model, options);
      const chartOption = Object.assign({}, options);
      // const { offsetWidth, offsetHeight } = chartEl.value;
      chartOption.chartArea = {};
      const colSize = 1 + segments.length * 2; // rows[0].length;
      const columnIndexes = [...Array(colSize).keys()];
      return {
        chartOption,
        model,
        vmodel,
        columnIndexes,
        view,
        rows,
        stats,
        event: null,
      };
    };

    onMounted(() => {
      const p0 = google.charts.load("50", { packages: ["corechart"] });
      const p1 = loadData();
      Promise.all([p0, p1]).then((results) => {
        console.log(results);
        const chartObj = buildChart(results[1]);
        installListener(chartObj);
        chart.value = chartObj;

        resizer = new ResizeObserver(debouncing);
        resizer.observe(chartEl.value);
      });
    });
    onUnmounted(() => {
      resizer.disconnect();
    });
    return {
      ctx,
      activeSegment,
      segments,
      section,
      chart,
      chartEl,
      chartEvent,
      sentences,
      closeSubmissionView,
      setActiveSegment,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
.chart-wrapper {
  flex: 1 1 auto;
  overflow: auto;
  display: flex;
  flex-direction: column;
  position: relative;

  .legend {
    display: flex;
    column-gap: 4px;
    padding: 8px 20px;
    .segment {
      border-radius: 16px;
      display: flex;
      cursor: pointer;
      &.active {
        outline: 4px solid transparent;
      }
      &:hover {
        transform: translate(-1px, -1px);
      }
      &:active {
        transform: translate(1px, 1px);
      }
      .dot {
        padding: 4px 6px;
        color: #fff;
        font-size: 10px;
        font-weight: bold;
      }
    }
  }
  .chart {
    flex: 1 1 auto;
    width: 100%;
    overflow: hidden;
    position: relative;
  }
  .empty-chart {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #ececec;
    padding: 8px 12px;
    border-radius: 24px;
  }
  .custom-tooltip {
    // width: 80%;
    background-color: white;
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 2px 2px 16px #0000004d;
    border-radius: 8px;
    overflow: hidden;
    z-index: 10000;
    &.h80 {
      height: 80%;
    }
    .head {
      display: flex;
      align-items: center;
      padding: 8px;
      column-gap: 8px;
    }

    .stats {
      padding: 0 16px;
      .score {
        margin-right: 8px;
        font-weight: bold;
        font-size: 1.2em;
        color: #bd0303;
      }
    }
    .scrollable {
      position: relative;
      background-color: white;
      padding: 8px;
      overflow: auto;
    }
  }
  @include mobile {
    .custom-tooltip {
      max-width: 400px;
      width: 90%;
    }
  }
  @include tablet {
    .custom-tooltip {
      width: 400px;
    }
  }
  @include desktop {
    .custom-tooltip {
      width: 400px;
    }
  }
}
</style>
