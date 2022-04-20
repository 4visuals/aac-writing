<template>
  <div class="chart-wrapper">
    <div class="ctrl">
      <div class="grouped">
        <div
          class="btn"
          v-for="dur in durations.options"
          :key="dur.value"
          @click="repaintChart(dur)"
        >
          {{ dur.value }}일
        </div>
      </div>
    </div>
    <VueApexCharts
      class="hm-chart"
      ref="chart"
      width="100%"
      height="400px"
      :options="options"
      :series="series"
      v-if="series.length > 0"
    />
  </div>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";
import api from "@/service/api";
import util from "@/service/util";
import { reactive, ref, shallowRef } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";
import { useStore } from "vuex";
export default {
  components: {
    VueApexCharts,
  },
  setup() {
    const store = useStore();
    const ctx = store.state.quiz.quizContext;
    const durations = reactive({
      selected: null,
      options: [
        {
          value: 7,
        },
        // {
        //   value: 14,
        // },
        // {
        //   value: 28,
        // },
      ],
    });
    const chart = shallowRef(null);
    durations.selected = durations.options[0];

    const series = ref([]);
    const options = shallowRef(null);
    const chartOptions = {
      chart: {
        type: "heatmap",
        background: "#fff",
        events: {
          dataPointSelection(e) {
            console.log(e);
          },
          mounted() {
            console.log("ready");
          },
        },
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        formatter: (val) => val,
      },

      legend: { show: false },
      parentHeightOffset: 0,
      plotOptions: {
        heatmap: {
          shadeIntensity: 0.5,
          enableShades: false,
          radius: 0,
          useFillColorAsStroke: true,
          colorScale: {
            ranges: [
              {
                from: 0,
                to: 0,
                name: "empty",
                color: "#ffffff00",
                foreColor: "#ffffff00",
              },
              {
                from: 1,
                to: 50,
                name: "very ppor",
                color: "#ff5400",
                foreColor: "#fff",
              },
              {
                from: 50,
                to: 60,
                name: "poor",
                color: "#ff9631",
              },
              {
                from: 60,
                to: 70,
                name: "not-bad",
                color: "#ffca95",
              },
              {
                from: 70,
                to: 80,
                name: "normal",
                color: "#fffe9b", // "#ffe500",
              },
              {
                from: 80,
                to: 90,
                name: "good",
                color: "#caff66", // "#ccf03a",
                foreColor: "#4a7002",
              },
              {
                from: 90,
                to: 1000,
                name: "best",
                color: "#00ce01", // "#2de574",
              },
            ],
          },
        },
      },

      xaxis: {
        type: "category",
        categories: [],
        floating: false,
      },
      yaxis: {
        show: false,
      },
    };

    const repaintChart = (duration) => {
      durations.selected = duration;
      loadSectionData(duration.value);
    };
    const scoring = (stat) => {
      const v = (stat.correct / stat.total) * 100;
      return parseInt(v);
    };

    const loadSectionData = (days) => {
      api.stats.sections("license", ctx.license.uuid).then((res) => {
        res.stats.forEach((stat) => {
          stat.time = {
            ymd: util.time.toYMD(stat.startTime),
          };
        });
        const ranges = util.time.range(new Date(), `${days} day`);
        const yLen = 10;
        series.value = [];
        for (let y = 0; y < yLen; y++) {
          series.value[y] = { name: `${y + 1}회`, data: [] };
          ranges.forEach((rng) => {
            const stats = res.stats.filter(
              (stat) => stat.time.ymd === rng.text
            );
            series.value[y].data.push(stats[y] ? scoring(stats[y]) : 0);
          });
        }
        chartOptions.xaxis.categories = ranges.map((rng) =>
          rng.text.substring(8).replace("-", "/")
        );
        options.value = chartOptions;
        options.value.chart.events.mounted = (e) => {
          console.log("[ddd]", e);
        };
      });
    };
    loadSectionData(durations.selected.value);
    watch(
      () => chart.value,
      () => {
        chart.value.$el.scrollLeft = 1200;
      }
    );
    return { chart, durations, options, series, repaintChart };
  },
};
</script>

<style lang="scss" scoped>
.chart-wrapper {
  flex: 1 1 auto;
  .grouped {
    display: flex;
    .btn {
      padding: 0.35rem 0.85rem;
      position: relative;
      &.selected {
        &:after {
          content: "";
          display: block;
          height: 2px;
          background-color: #0071ff;
          width: calc(100% - 1.7rem);
          left: 0.85rem;
          bottom: 0px;
          position: absolute;
        }
      }
    }
  }
  .hm-chart {
    overflow-x: auto;
    overflow-y: hidden;
  }
}
</style>
