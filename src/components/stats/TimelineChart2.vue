<template>
  <div class="timelines">
    <div class="range-filter">
      <button @click="rangeRecent(7)">최근7일</button>
      <button @click="rangeRecent(60)">최근60일</button>
      <button @click="thisWeek()">이번주</button>
      <button @click="thisMonth()">이번달</button>
    </div>
    <div class="chart">
      <div class="y-axis">
        <div class="cell" v-for="sec in ySections" :key="sec.seq">
          {{ sec.level }}단계
        </div>
      </div>
      <div class="grid-area" ref="gridEl" @wheel.prevent.stop="pageScroll">
        <div class="cols" v-for="ymd in xDates" :key="ymd.text">
          <div class="cell" v-for="sec in ySections" :key="sec.seq">
            <ChartCell :stat="sectionAt(ymd.text, sec)" />
          </div>
          <div class="cell x-axis">{{ ymd.text.substring(8) }}일</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { nextTick, ref, shallowRef, watch } from "@vue/runtime-core";
import { time } from "@/service/util";
import { useStore } from "vuex";
import ChartCell from "./ChartCell.vue";
export default {
  components: {
    ChartCell,
  },
  props: ["chartData", "resourceType"],
  setup(props) {
    console.log(props);
    const store = useStore();

    const scrollToEnd = () => {
      nextTick().then(() => {
        const { scrollWidth } = gridEl.value;
        gridEl.value.scrollLeft = scrollWidth;
      });
    };
    const rangeMark = {
      start: null,
      end: null,
    };
    const thisWeek = () => {
      const ranges = time.weekRange(new Date());
      rangeMark.start = ranges[0];
      rangeMark.end = ranges[ranges.length - 1];
      xDates.value = ranges;
      scrollToEnd();
    };
    const thisMonth = () => {
      xDates.value = time.monthRange(new Date());
      scrollToEnd();
    };
    const rangeRecent = (days) => {
      xDates.value = time.range(new Date(), `${days} day`);
      scrollToEnd();
    };

    const findSection = store.getters["course/section"];
    const xDates = shallowRef(time.range(new Date(), "7 day"));
    const ySections = shallowRef(null);
    const ymdMap = new Map(); // X-Axis
    const gridEl = ref();
    const normalizeData = (stats) => {
      ymdMap.clear();
      const sectionMap = new Map(); // Y-Axis
      stats.forEach((stat) => {
        const ymd = time.toYMD(stat.startTime); // yyyy-mm-dd
        let list = ymdMap.get(ymd);
        if (!list) {
          ymdMap.set(ymd, (list = []));
        }
        const section = findSection(stat.sectionRef);
        if (!sectionMap.has(stat.sectionRef)) {
          sectionMap.set(stat.sectionRef, section);
        }
        if (stat.type === props.resourceType) {
          list.push({ ymd, stat, section });
        }
      });
      // xDates.value = [...ymdMap.keys()];
      const sections = [...sectionMap.values()];
      sections.sort((a, b) => a.seq - b.seq);
      ySections.value = sections;
    };

    const sectionAt = (ymd, section) => {
      const list = ymdMap.get(ymd);
      if (!list) {
        return null;
      }
      const sections = list.filter((elem) => elem.section === section);
      if (sections.length === 0) {
        return null;
      }
      const stat = sections.reduce(
        (stat, sec) => {
          stat.total += sec.stat.total;
          stat.correct += sec.stat.correct;
          stat.failed += sec.stat.failed;
          return stat;
        },
        { total: 0, correct: 0, failed: 0 }
      );
      return stat;
    };

    const pageScroll = (e) => {
      const { deltaY } = e;
      const el = gridEl.value;
      const { scrollLeft, offsetWidth, scrollWidth } = el;
      if (offsetWidth >= scrollWidth) {
        return;
      }
      if (deltaY > 0 && scrollLeft + offsetWidth === scrollWidth) {
        return;
      }
      if (deltaY < 0 && scrollLeft === 0) {
        return;
      }
      el.scrollBy({ top: 0, left: deltaY / 2 });
    };
    // const setRange = () => {
    //   xDates.value = time.weekRange(new Date());
    // };
    watch(
      () => props.chartData,
      (data) => {
        normalizeData(data);
      }
    );
    watch(
      () => props.resourceType,
      () => {
        normalizeData(props.chartData);
      }
    );
    return {
      gridEl,
      xDates,
      ySections,
      sectionAt,
      rangeRecent,
      thisWeek,
      thisMonth,
      pageScroll,
    };
  },
};
</script>

<style lang="scss" scoped>
.timelines {
  .range-filter {
    display: flex;
    justify-content: flex-end;
  }
  .chart {
    display: flex;
    margin: 8px 0;
    overflow-y: hidden;
    column-gap: 8px;
    .y-axis {
      box-shadow: 0px 0px 6px #0000004d;
    }
    .cell {
      position: relative;
      height: 24px;
      min-width: 60px;
      white-space: nowrap;
    }
    .grid-area {
      display: flex;
      flex: 1 1 auto;
      overflow-x: auto;
      &::-webkit-scrollbar {
        width: 0px;
        height: 0px;
        position: absolute;
        left: 0;
      }
      .cols {
        flex: 1 1 auto;
        .cell {
          min-width: 40px;
          border-bottom: 1px solid #eee;
          &.x-axis {
            border-bottom-color: transparent;
          }
        }
      }
    }
  }
}
</style>
