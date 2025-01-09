<template>
  <div class="chart-view" ref="chartEl">
    <div class="chart"></div>
    <div class="info" v-if="!chartFormat">empty</div>
  </div>
</template>

<script setup>
import { onMounted, shallowRef, watch, defineProps, defineEmits } from "vue";
const colors = [
  "#FBA037",
  "#E62E7B",
  "#91CC26",
  "#5BC5FF",
  "#9952D6",
  "#E85BFF",
  "#444444",
];

const DEFAULT_CHART_OPTION = {
  legend: { position: "bottom" },
  // axisTitlesPosition: "in",
  aggregationTarget: "series",
  selectionMode: "single",
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
const props = defineProps(["chartFormat", "chartOption"]);
const emits = defineEmits(["select"]);
const chartEl = shallowRef(null);
/**
 * @type {{chartOption: any, view: DataView, model: DataTable }}
 */
const chart = shallowRef(null);

const renderChart = () => {
  const { view, chartOption } = chart.value;
  const { data, options } = props.chartFormat;
  const model = new google.visualization.DataTable(data);
  const width = chartEl.value.offsetWidth;
  const height = chartEl.value.offsetHeight;
  chartOption.chartArea = {
    left: 40,
    top: 40,
    width: width - 40,
    height: height - 100,
  };
  chartOption.width = width;
  chartOption.height = height;
  if (options?.title) {
    chartOption.title = options?.title;
  }
  view.draw(model, chartOption);
  chart.value.model = model;
  chart.value.chartOption = chartOption;
};
const installListener = (view) => {
  google.visualization.events.addListener(view, "select", () => {
    const sels = view.getSelection();
    if (sels.length === 0) {
      return;
    }
    let { row, column } = sels[0];
    if (row === null || column === null) {
      return;
    }
    const { model } = chart.value;
    if (column === 3) {
      // annotation을 클릭하면 3이 나온다.
      column = 1;
    }
    const property = model.getProperties(row, 1);
    // console.log(property);
    property.resourceType = props.chartFormat.type;
    emits("select", property);
  });
};
const buildChart = () => {
  const el = chartEl.value.querySelector(".chart");
  const view = new google.visualization.ColumnChart(el);
  const chartOption = Object.assign(
    {},
    props.chartOption || DEFAULT_CHART_OPTION
  );
  installListener(view);
  return { chartOption, view };
};

watch(props, () => {
  if (props.chartOption) {
    chart.value.chartOption = Object.assign({}, props.chartOption);
  }
  if (!props.chartFormat) {
    chart.value.view.clearChart();
  } else {
    renderChart();
  }
});
onMounted(() => {
  chart.value = buildChart();
  if (props.chartFormat?.data.rows) {
    renderChart();
  }
});

// export default {
//   emits: ["select"],
//   props: ["chartFormat"],
//   setup(props, { emit }) {

//     return {
//       chartEl,
//     };
//   },
// };
</script>

<style lang="scss" scoped>
.chart-view {
  flex: 1 1 50%;
  display: flex;
  position: relative;
  .chart {
    flex: 1 1 auto;
  }
  .info {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #0000004d;
  }
}
</style>
