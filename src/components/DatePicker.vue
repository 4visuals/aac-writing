<template>
  <div class="date-picker">
    <ParaText class="date-ymd" @click="toggleGrid"
      ><ActionIcon icon="calendar_month" /><span>{{
        toYmdText()
      }}</span></ParaText
    >
    <div class="cal-view" v-if="visible">
      <div class="year-nav">
        <ActionIcon icon="arrow_left" @click="setYear(-1)" />
        <div class="year">{{ curDate.year }}</div>
        <ActionIcon icon="arrow_right" @click="setYear(+1)" />
      </div>
      <div class="month-view">
        <div class="m-row" v-for="(_, row) in grid.dim.row" :key="row">
          <div class="m-col" v-for="(_, col) in grid.dim.col" :key="col">
            <AacButton
              fill
              size="xs"
              :class="{ selected: row === grid.row && col === grid.col }"
              class="btn-month"
              :text="`${row * grid.dim.col + col + 1}월`"
              @click="setActive(row, col)"
            ></AacButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import { ActionIcon } from "@/components/form";
import { ParaText } from "@/components/text";
export default {
  props: ["time", "visible"],
  components: {
    ActionIcon,
    ParaText,
  },
  setup(props, { emit }) {
    const d = new Date();
    if (props.time) {
      d.setTime(props.time);
    }
    const curDate = ref({
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      date: d.getDate(),
    });
    const grid = ref({
      visible: false,
      dim: {
        row: 4,
        col: 3,
      },
      row: parseInt((curDate.value.month - 1) / 3),
      col: parseInt((curDate.value.month - 1) % 3),
    });

    const notify = (type) => {
      const mm = curDate.value.month;
      emit("cur-date", {
        year: "" + curDate.value.year,
        month: mm < 10 ? "0" + mm : "" + mm,
        date: "15",
        changed: type,
      });
    };
    const setYear = (inc) => {
      curDate.value.year += inc;
      notify("year");
    };
    const setMonth = (month) => {
      curDate.value.month = month;
      notify("month");
    };
    const setActive = (row, col) => {
      grid.value.row = row;
      grid.value.col = col;
      setMonth(row * grid.value.dim.col + col + 1);
    };
    const toggleGrid = () => {
      emit("toggle", props.visible);
    };
    const toYmdText = () => {
      return `${curDate.value.year}-${curDate.value.month}`;
    };
    return {
      grid,
      curDate,
      setActive,
      setYear,
      setMonth,
      toggleGrid,
      toYmdText,
    };
  },
};
</script>

<style lang="scss" scoped>
.date-picker {
  position: relative;
  .date-ymd {
    display: inline-flex;
    align-items: center;
    column-gap: 8px;
  }
  .cal-view {
    position: absolute;
    box-shadow: 2px 2px 4px #0000004d, 1px 1px 4px #0000002d;
    padding: 8px;
    background-color: white;
    .year-nav {
      display: flex;
      font-size: 3rem;
      .year {
        flex: 1 1 auto;
        text-align: center;
        font-size: 2rem;
      }
    }
    .month-view {
      .m-row {
        display: flex;
        align-items: center;
        justify-content: center;
        .m-col {
          flex: 1 1 auto;
          margin: 2px;
        }
      }
      .btn-month {
        border: 1px solid #dcdcdc;
        white-space: nowrap;
        &.selected {
          background-color: #f9bbd0;
          color: var(--aac-color-pink-900);
        }
      }
      .col {
        padding: 0;
        margin: 2px;
      }
    }
  }
}
</style>
