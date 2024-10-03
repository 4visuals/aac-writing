<template>
  <div class="stat">
    <div class="control">
      <TabView :model="tabModel" />
      <div class="tab-body">
        <div v-if="activeTab.cmd === 'level'">
          <CourseControlMenu :exams="exams" @chart="showChart" />
        </div>
        <div v-else-if="activeTab.cmd === 'date'">
          <DateControlMenu :exams="exams" @chart="showChart" />
        </div>
      </div>
    </div>
    <div class="chart">
      <div class="half">
        <GoogleBarChart
          :chartOption="chartOption"
          :chartFormat="chartData"
          @select="showDetail"
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
import { reactive, ref, defineProps, watch, shallowRef } from "vue";

const props = defineProps(["exams"]);
const tabModel = TabModel.create([
  { text: "단계별", cmd: "level", clazz: "level" },
  { text: "날짜별", cmd: "date", clazz: "date" },
]);
const { activeTab } = tabModel;
const visible = ref(false);

const chartOption = shallowRef(undefined);
const chartData = reactive({
  option: { title: "날짜별" },
  area: { width: 600, height: 400 },
  data: { cols: undefined, rows: undefined },
});
const showChart = (e) => {
  chartOption.value = e.chartOption;
  chartData.data.cols = e.cols;
  chartData.data.rows = e.rows;
  visible.value = false;
  setTimeout(() => {
    visible.value = true;
  });
};
const showDetail = () => {};
watch(
  () => props.exams,
  (exams) => {
    console.log("[exam]", exams);
  }
);
</script>

<style lang="scss" scoped>
.stat {
  display: flex;
  column-gap: 8px;
  height: 100%;
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
