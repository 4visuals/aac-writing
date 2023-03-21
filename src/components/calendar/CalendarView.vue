<template>
  <div class="calendar">
    <div class="weeks">
      <div class="seven-days">
        <div class="day border-rb" v-for="day in days" :key="day">
          {{ day }}
        </div>
      </div>
      <div
        class="week"
        v-for="(week, idx) in month.currentWeeks"
        :key="week.index"
      >
        <div
          class="border-rb"
          :class="`day row-${idx} col-${day.dayOfWeek} ${
            hasData(monthMap, day) ? 'has-data' : ''
          } ${current.month !== day.month ? 'inactive' : ''}`"
          v-for="day in week.days"
          :key="day.toYMD()"
        >
          <span
            class="date"
            :class="{
              today: month.month === today.month && day.date === today.date,
            }"
            >{{ day.date }}</span
          >
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
import { logger } from "@/service/util";
import { computed } from "@vue/reactivity";
import { shallowRef, watch } from "vue";
import { useStore } from "vuex";
import { Day, fromDate } from ".";
export default {
  emits: ["exams", "today"],
  props: { current: Day },
  setup(props, { emit }) {
    const days = "일월화수목금토".split("");
    // eslint-disable-next-line vue/no-setup-props-destructure
    const today = props.current;
    const month = shallowRef(fromDate(props.current));
    const store = useStore();
    const historyMap = computed(() => store.state.exam.histories);
    const monthMap = shallowRef(null);
    const loginUser = computed(() => store.getters["user/currentUser"]);
    const license = computed(() => store.getters["exam/activeLicense"]);
    /**
     * 새로고침에도 대응해야함.
     */
    let dataLoaded = false;
    const loadExamData = () => {
      if (!dataLoaded && loginUser.value && license.value) {
        dataLoaded = true;
        store.dispatch("exam/queryExams");
      }
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
      const cur = props.current;
      const papers = monthMap.value.get(cur.toYMD());
      logger.log(papers);
      emit("today", papers);
    };

    const countExams = (_, date) => {
      return _.get(date.toYMD()).length;
    };
    const hasData = (_, date) => _ && countExams(_, date) > 0;

    const showDetail = (day) => {
      const papers = monthMap.value.get(day.toYMD());
      emit("exams", { day, papers });
    };
    watch(historyMap, (histories) => {
      logger.log(histories);
      updateMonthData();
      notifyTodayData();
    });
    watch(loginUser, loadExamData, { immediate: true });
    watch(license, loadExamData, { immediate: true });
    watch(
      () => props.current,
      () => {
        month.value = props.current;
        updateMonthData();
      }
    );

    return {
      days,
      today,
      monthMap,
      month,
      countBy,
      hasData,
      countExams,
      showDetail,
    };
  },
};
</script>

<style lang="scss" scoped>
$border-color: #eeeeee;
$inner-gap: 12px;
$fisze: 1em;
.calendar {
  display: flex;
  flex-direction: column;
  .border {
    &-rb {
      border-right: 1px solid $border-color;
      border-bottom: 1px solid $border-color;
    }
    &-none {
      &-r {
        border-right: none;
      }
      &-l {
        border-left: none;
      }
    }
  }
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
    .seven-days {
      display: flex;
      border-top: 1px solid $border-color;
      .day {
        flex: 1;
        display: inline-flex;
        justify-content: center;
        padding: 8px 0;
        &:last-child {
          border-right: none;
        }
      }
    }
    .week {
      display: flex;
      flex: 1 1 auto;
      .day {
        flex: 1;
        position: relative;
        cursor: pointer;
        & > .date {
          position: absolute;
          right: 0;
          display: flex;
          padding: 8px;
          z-index: 10;
          border-radius: 50px;
          width: 28px;
          height: 28px;
          align-items: center;
          justify-content: center;
          margin: $inner-gap;
          line-height: 1;
          font-size: $fisze;
          font-weight: 600;
          &.today {
            border-radius: 30px;
            background-color: #9952d6;
            color: white !important;
          }
        }
        &:hover {
          background-color: aliceblue;
        }
        .inner {
          position: absolute;
          top: -1px;
          left: -1px;
          right: -2px;
          bottom: -2px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: $fisze;
          border-radius: 8px;
        }
        &.has-data {
          .date {
            color: #4e5819;
          }
          .inner {
            border: 2px solid #9952d6;
            font-weight: 600;
            .cnt {
              position: absolute;
              top: 0;
              left: 0;
              background-color: #9952d6;
              color: white;
              margin: $inner-gap;
              padding: 2px 8px;
              border-radius: 6px;
              border-radius: 6px;
              font-weight: 600;
              line-height: 20px;
            }
          }
        }
        &.inactive {
          .date {
            color: #999;
            font-size: 1em;
          }
        }
        &:last-child {
          border-right: none;
        }
      }
    }
  }
}
</style>
