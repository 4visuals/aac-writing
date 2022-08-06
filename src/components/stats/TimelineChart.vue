<template>
  <div class="chart">
    <VueApexCharts
      v-if="timeline"
      type="rangeBar"
      height="350"
      :options="timeline.chartOptions"
      :series="timeline.series"
    />
  </div>
</template>

<script>
import { shallowRef, watch } from "@vue/runtime-core";
import VueApexCharts from "vue3-apexcharts";
import { time } from "@/service/util";
import { useStore } from "vuex";
export default {
  props: ["chartData"],
  components: {
    VueApexCharts,
  },

  setup(props) {
    const store = useStore();
    const timeline = shallowRef(null);
    const sections = store.getters["course/sections"];
    console.log("[ti]", props.chartData);

    const normalizeData = (stats) => {
      console.log(stats);
      const data = stats.map((data) => {
        const ymd0 = time.toYMD(data.startTime);
        const ymd1 = time.toYMD(data.startTime + 24 * 60 * 60 * 1000);
        return {
          x: "" + data.sectionRef,
          y: [new Date(ymd0).getTime(), new Date(ymd1).getTime()],
        };
      });
      timeline.value = {
        chartOptions: {
          chart: {
            height: 300,
            type: "rangeBar",
          },
          tooltip: {
            custom: (opt) => {
              const { seriesIndex, dataPointIndex, w } = opt;
              const startTime =
                w.config.series[seriesIndex].data[dataPointIndex];
              // const startTime = series[seriesIndex][dataPointIndex];
              return time.toYMD(startTime.y[0]);
            },
            x: {
              show: true,
              // formatter: (xVal) => {
              //   console.log("[tt]", new Date(xVal));
              //   return null;
              // },
            },
            y: { show: false },
          },
          plotOptions: {
            bar: {
              horizontal: true,
              // distributed: true,
              // dataLabels: {
              //   hideOverflowingLabels: false,
              // },
            },
          },
          dataLabels: {
            enabled: true,
            formatter: (val, opts) => {
              const label = opts.w.globals.seriesX[0][opts.dataPointIndex];
              const sectionSeq = parseInt(label);
              // console.log(label, val, opts);
              const section = sections.find((s) => s.seq === sectionSeq);
              return section.level === 0 ? "TEST" : `${section.level}단계~`;
            },
            style: {
              colors: ["#f3f4f5", "#fff"],
            },
          },
          xaxis: {
            type: "datetime",
          },
          yaxis: {
            // show: false,

            labels: {
              formatter: (val, idx) => {
                // console.log("[Y]", val, idx);
                if (idx && idx.dataPointIndex >= 0) {
                  const sectionSeq = parseInt(val);
                  const section = sections.find((s) => s.seq === sectionSeq);
                  return section
                    ? section.level === 0
                      ? "도전"
                      : `${section.level}단계`
                    : "----";
                } else {
                  return "____";
                }
              },
            },
          },
          grid: {
            row: {
              colors: ["#f3f4f5", "#fff"],
              opacity: 1,
            },
          },
        },

        series: [
          {
            name: "Bob",
            data,
            /*
            data: [
              {
                x: "1",
                y: [
                  new Date("2019-03-05").getTime(),
                  new Date("2019-03-06").getTime(),
                ],
                range: "a",
              },
            ],
            */
          },
        ],
      };
    };

    watch(
      () => props.chartData,
      (data) => {
        // console.log("[NEW STATS]", data);
        normalizeData(data);
      }
    );

    return { timeline };
  },
};
</script>

<style></style>
