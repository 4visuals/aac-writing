<template>
  <div class="chart-wrapper">
    <div class="chart" ref="chartEl"></div>
    <div v-if="chartEvent.active" class="custom-tooltip">
      <h3 class="head">
        <ActionIcon icon="arrow_back_ios" @click="closeSubmissionView" />
        <span>{{ section.description }}</span>
      </h3>
      <div class="body">
        <div class="stats">
          <ParaText
            ><span>{{ chartEvent.stats.date }}</span
            >(<span>{{ chartEvent.stats.range }}번</span>)</ParaText
          >
          <ParaText :small="true"
            ><span class="score">최종 {{ chartEvent.stats.score }}점</span
            ><span class="cnt"
              >전체: {{ chartEvent.stats.total }}, 정답:
              {{ chartEvent.stats.correct }}</span
            ></ParaText
          >
        </div>
        <SubmissionView
          :sentences="chartEvent.sentences"
          :exams="chartEvent.exams"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ParaText } from "@/components/text";
import { ActionIcon } from "@/components/form";
import api from "@/service/api";
import { time } from "@/service/util";
import { onMounted, ref, shallowRef } from "vue";
import { useStore } from "vuex";
import SubmissionView from "./SubmissionView.vue";

const colors = [
  "#f3a600",
  "#00acc2",
  "#c2ac88",
  "#5e97f6",
  "#db4537",
  "#0e9d59",
  "#ab47bc",
];
const options = {
  legend: { position: "top", alignment: "center" },
  aggregationTarget: "series",
  selectionMode: "single", // ["single", "multiple"], // 여러개의 legend를 활성화할 것인지
  dataOpacity: 1,
  // focusTarget: "category",
  fontSize: 12,
  // series,
  colors,
  chartArea: { left: 40, top: 40, width: "95%", height: "90%" },
  hAxis: {
    title: null,
  },
  interpolateNulls: true,
  pointSize: 8,
  theme: "material",
  tooltip: {
    isHtml: true,
    textStyle: { color: "#444" },
    showColorCode: true,
    trigger: "focus", // "selection",
  },
  // vAxes: {
  //   0: { title: null },
  // },
  vAxis: {
    minValue: 0,
    maxValue: 100,
    title: null,
    viewWindowMode: "pretty",
    // ticks: [0, 20, 40, 60, 80, 100],
  },

  // height: 500,
};

export default {
  components: {
    ActionIcon,
    SubmissionView,
    ParaText,
  },
  setup() {
    const chartEl = ref(null);
    const chart = shallowRef(null);
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
    const type = ctx.resourceType;
    const findSection = store.getters["course/section"];
    const section = findSection(ctx.sectionSeq);
    const sentences = section.sentences.filter((sen) => sen.type === type);
    const segments = [...Array(sentences.length / 10).keys()].map(
      (offset) => offset * 10
    );

    const hideColumns = (chart, indexes) => {
      const { vmodel, view, columnIndexes } = chart;
      if (indexes) {
        vmodel.hideColumns(indexes);
      } else {
        vmodel.setColumns(columnIndexes);
      }
      view.draw(vmodel, options);
    };
    const closeSubmissionView = () => {
      chartEvent.value = Object.assign({}, EVENT_TEMPLATE);
      chart.value.view.setSelection();
    };
    // console.log(type, segments, sentences);

    // const sortByYmdAndOffset = (a, b) => {
    //   let cmp = a.ymd.localeCompare(b.ymd);
    //   return cmp === 0 ? a.questionOffset - b.questionOffset : cmp;
    // };
    const createTableRows = (ymdMap, ySegments, stats) => {
      // const rowMap = new Map();
      for (let ymd of ymdMap.keys()) {
        const scores = ySegments.flatMap((offset, index) => {
          const exams = stats.filter(
            (stat) => stat.ymd === ymd && stat.questionOffset === offset
          );
          if (exams.length === 0) {
            return [null, `color: ${colors[index]}`];
          }
          const acc = exams.reduce(
            (acc, exam) => {
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
    const installListener = (chart) => {
      const { view } = chart;
      google.visualization.events.addListener(view, "click", (e) => {
        console.log("[click]", e);
        const { targetID } = e;
        if (targetID === "chartarea") {
          hideColumns(chart, null);
        } else if (targetID.startsWith("legendentry")) {
          chartEvent.value.click = e;
          chartEvent.value.type = "legend";
        } else if (targetID.startsWith("point")) {
          chartEvent.value.click = e;
          chartEvent.value.active = true;
          chartEvent.value.type = "point";
        } else {
          closeSubmissionView();
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
          if (!chartEvent.value.active) {
            return;
          }
          chartEvent.value.select = s[0];
          const { row, column } = s[0];
          const rowData = chart.rows[row]; // ['2022-09-01', 23, 45, 11]
          const ymd = rowData[0];

          const realColumn = chart.vmodel.getTableColumnIndex(column);
          const offset = segments[(realColumn - 1) / 2];
          const exams = chart.stats.filter(
            (stat) => stat.ymd === ymd && stat.questionOffset === offset
          );
          chartEvent.value.exams = exams;
          chartEvent.value.sentences = sentences.slice(offset, offset + 10);
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
          stats.date = ymd;
          stats.range = `${offset + 1} ~ ${offset + 10}`;

          chartEvent.value.stats = stats;
        } else if (chartEvent.value.type == "legend") {
          const { column } = s[0];
          console.log("[legend]", column);
          // const colsToHide = chart.columnIndexes.filter(
          //   (idx) => idx > 0 && idx !== column
          // );
          // const cols = [
          //   0,
          //   { sourceColumn: column, type: "number", label: "dd" },
          //   // { sourceColumn: column + 1, type: "string" },
          // ];
          const cols = [0, column, column + 1];
          // chart.vmodel.hideColumns(colsToHide);
          chart.vmodel.setColumns(cols);
          view.draw(chart.vmodel, options);
        }

        // console.log(rowData, exams, column, segments);
      });
    };
    const loadData = () => {
      return api.exam
        .querySectionQuiz(ctx.sectionSeq, ctx.resourceType, ctx.license.uuid)
        .then((res) => {
          const stats = res.papers.map((paper) => {
            const total = paper.numOfQuestions; // paper.submissions.length;
            const correct = paper.submissions.filter(
              (submit) => submit.correct
            ).length;
            const failed = total - correct;
            const ymd = time.toYMD(paper.startTime);
            return { ...paper, total, correct, failed, ymd };
          });
          return stats;
        });
    };
    const buildChart = (stats) => {
      const model = new google.visualization.DataTable();
      model.addColumn("string", "Date");
      segments.forEach((offset) => {
        model.addColumn("number", `${offset + 1}~${offset + 10}`);
        model.addColumn({ type: "string", role: "style" });
      });

      // stats.sort(sortByYmdAndOffset);
      const ymdMap = stats
        .map((stat) => [stat.ymd])
        .reduce((map, row) => {
          map.set(row[0], row);
          return map;
        }, new Map());
      const rows = createTableRows(ymdMap, segments, stats);
      model.addRows(rows);

      const vmodel = new google.visualization.DataView(model);
      const view = new google.visualization.LineChart(chartEl.value);
      // view.draw(model, options);
      view.draw(vmodel, options);
      const colSize = rows[0].length;
      const columnIndexes = [...Array(colSize).keys()];
      return { model, vmodel, columnIndexes, view, rows, stats, event: null };
    };

    onMounted(() => {
      const p0 = google.charts.load("51", { packages: ["corechart"] });
      const p1 = loadData();
      Promise.all([p0, p1]).then((results) => {
        console.log(results);
        const chartObj = buildChart(results[1]);
        installListener(chartObj);
        chart.value = chartObj;
      });
    });
    return {
      section,
      chart,
      chartEl,
      chartEvent,
      sentences,
      closeSubmissionView,
    };
  },
};
</script>

<style lang="scss" scoped>
.chart-wrapper {
  flex: 1 1 auto;
  overflow: auto;
  display: flex;
  flex-direction: row;
  position: relative;
  .chart {
    flex: 1 1 auto;
    width: 100%;
    overflow: hidden;
  }
  .custom-tooltip {
    // width: 80%;
    width: 90%;
    max-width: 300px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    border: solid 1px #bdbdbd;
    border-radius: 2px;
    background-color: white;
    position: absolute;
    box-shadow: 0px 2px 2px 0px rgb(204 204 204 / 60%);
    font-size: 12px;
    padding: 0px;
    z-index: 10000;

    .head {
      display: flex;
      align-items: center;
      padding: 8px;
      column-gap: 8px;
    }

    .body {
      .stats {
        padding: 0 16px;
        .score {
          margin-right: 8px;
          font-weight: bold;
          font-size: 1.2em;
          color: #bd0303;
        }
      }
    }
  }
}
</style>
