<template>
  <div class="calendar">
    <div class="cal-head">
      <ActionIcon class="move" icon="chevron_left" @click="shiftMonth(-1)" />
      <h3>{{ month.year }}년 {{ month.monthText }}월</h3>
      <ActionIcon class="move" icon="chevron_right" @click="shiftMonth(1)" />
    </div>
    <div class="weeks">
      <div class="seven-days">
        <div class="day" v-for="day in days" :key="day">{{ day }}</div>
      </div>
      <div
        class="week"
        v-for="(week, idx) in month.currentWeeks"
        :key="week.index"
      >
        <div
          :class="`day row-${idx} col-${day.dayOfWeek} ${
            hasData(monthMap, day) ? 'has-data' : ''
          } ${month.month !== day.month ? 'inactive' : ''}`"
          v-for="day in week.days"
          :key="day.toYMD()"
        >
          <span class="date">{{ day.date }}</span>
          <div class="inner" v-if="hasData(monthMap, day)">
            <div class="cnt" @click="showDetail(day)">
              {{ countExams(monthMap, day) }}건
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "@vue/reactivity";
import { shallowRef, watch } from "vue";
import { useStore } from "vuex";
import { fromDate, Day } from ".";
import { ActionIcon } from "../../components/form";
export default {
  components: { ActionIcon },
  emits: ["exams"],
  props: { current: Date },
  setup(props, { emit }) {
    const days = "일월화수목금토".split("");
    const month = shallowRef(fromDate(props.current));
    const store = useStore();
    const historyMap = computed(() => store.state.exam.histories);
    const monthMap = shallowRef(null);
    const loadExamData = () => {
      store.dispatch("exam/queryExams");
    };

    const countBy = (day) => {
      const ymd = day.toYMD();
      const ym = ymd.substring(0, "yyyy-mm".length);
      const examsInMonth = historyMap.value.get(ym);
      if (!examsInMonth || examsInMonth.length === 0) {
        return [];
      }
      const exams = examsInMonth.filter((exam) => exam.ymd === ymd);
      return exams;
    };
    const updateMonthData = () => {
      const weeks = month.value.currentWeeks;
      const map = new Map();
      weeks.forEach((week) => {
        week.days.forEach((date) => {
          const ymd = date.toYMD();
          map.set(ymd, countBy(date));
        });
      });
      monthMap.value = map;
    };
    const notifyTodayData = () => {
      const cur = Day.fromDate(props.current);
      const papers = monthMap.value.get(cur.toYMD());
      console.log(papers);
      emit("today", papers);
    };

    const countExams = (_, date) => {
      return _.get(date.toYMD()).length;
    };
    const hasData = (_, date) => _ && countExams(_, date) > 0;

    const shiftMonth = (delta) => {
      const newMonth =
        delta === 1 ? month.value.nextMonth() : month.value.prevMonth();
      month.value = newMonth;

      updateMonthData();
    };
    const showDetail = (day) => {
      const papers = monthMap.value.get(day.toYMD());
      emit("exams", { day, papers });
    };
    watch(historyMap, (histories) => {
      console.log(histories);
      updateMonthData();
      notifyTodayData();
    });
    loadExamData();

    return {
      days,
      monthMap,
      month,
      countBy,
      hasData,
      countExams,
      shiftMonth,
      showDetail,
    };
  },
};
</script>

<style lang="scss" scoped>
.calendar {
  display: flex;
  flex-direction: column;
  .cal-head {
    display: flex;
    padding: 8px;
    column-gap: 16px;
    justify-content: center;
    .move {
      font-size: 2.2rem;
    }
  }
  .weeks {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    row-gap: 1px;
    padding: 8px;
    .seven-days {
      display: flex;
      column-gap: 1px;
      .day {
        flex: 1;
        display: inline-flex;
        justify-content: center;
        background-color: #dceaff;
        padding: 4px 0;
      }
    }
    .week {
      display: flex;
      flex: 1 1 auto;
      column-gap: 1px;
      .day {
        flex: 1;
        position: relative;
        cursor: pointer;
        & > .date {
          position: relative;
          display: inline-flex;
          padding: 8px;
          z-index: 10;
          border-radius: 50px;
          width: 24px;
          height: 24px;
          align-items: center;
          justify-content: center;
          font-size: 1.2em;
          margin: 4px;
        }
        &:hover {
          background-color: aliceblue;
        }
        .inner {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        &.has-data {
          .date {
            color: #4e5819;
            font-weight: 500;
          }
          .inner {
            background-color: #d9ed64;
          }
        }
        &.inactive {
          .date {
            color: #999;
            font-size: 1em;
          }
        }
      }
    }
  }
}
</style>
