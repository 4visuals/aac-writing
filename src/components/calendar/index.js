import CalendarView from "./CalendarView.vue";
import CalendarNav from "./CalendarNav.vue";

const ONE_DAY = 1 * 24 * 60 * 60 * 1000; // millis
const UNIT = {
  DAY: ONE_DAY,
};
const shift = (d, qtt, unit, dir) => {
  const millis = d.getTime();
  const millisOffset = qtt * UNIT[unit];
  return new Date(millis + dir * millisOffset);
};
const before = (d, quantity, unit) => shift(d, quantity, unit, -1);
const after = (d, quantity, unit) => shift(d, quantity, unit, +1);
const DAYS = "일월화수목금토".split("");

const padZero = (num) => ("0" + num).slice(-2);
class Day {
  constructor(year, month, date, dayOfWeek) {
    this.year = year;
    this.month = month;
    this.date = date;
    this.dayOfWeek = dayOfWeek;
  }
  get dayText() {
    return DAYS[this.dayOfWeek];
  }
  toYMD() {
    return `${this.year}-${padZero(this.month)}-${padZero(this.date)}`;
  }
}
Day.fromDate = (d) =>
  new Day(d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getDay());
const fitToWeekend = (date) => {
  let dayOfWeek = date.getDay();
  if (dayOfWeek !== 0) {
    date = after(date, 6 - dayOfWeek, "DAY");
  }
  return date;
};

class Week {
  constructor(index, days, meta) {
    this.index = index;
    this.days = days;
    this.meta = meta;
  }
  get weekIndex() {
    return this.index;
  }
  get months() {
    return this.meta.months;
  }
  dayOf(dayIndex) {
    return this.days[dayIndex];
  }
  isMonthIn(month) {
    return this.months.includes(month);
  }
}

class Month {
  constructor(year, month, weeksOfYear) {
    this.year = year;
    this.month = month;
    this.weeksOfYear = weeksOfYear;
  }
  get currentWeeks() {
    return this.weeksOfYear.filter((week) => week.isMonthIn(this.month));
  }
  get ym() {
    return `${this.year}-${("0" + this.month).slice(-2)}`;
  }
  get monthText() {
    return ("0" + this.month).slice(-2);
  }
  prevMonth() {
    if (this.month === 1) {
      // 이전해로 넘어간다!
      const weeksOfYear = sliceYear(this.year - 1);
      return new Month(this.year - 1, 12, weeksOfYear);
    } else {
      return new Month(this.year, this.month - 1, this.weeksOfYear);
    }
  }
  nextMonth() {
    if (this.month === 12) {
      // 다음해로 넘어간다!
      const weeksOfYear = sliceYear(this.year + 1);
      return new Month(this.year + 1, 1, weeksOfYear);
    } else {
      return new Month(this.year, this.month + 1, this.weeksOfYear);
    }
  }
}
const sliceYear = (year) => {
  const firstDay = new Date(`${year}-01-01T00:00:00`);
  const dayOfWeek = firstDay.getDay();
  const start = before(firstDay, dayOfWeek, "DAY");

  const endDay = new Date(`${year + 1}-01-01T00:00:00`);
  const end = fitToWeekend(endDay);
  const dates = [];
  const weeks = [];
  let weekIndex = 0;
  let cur = start;
  const months = new Set();
  while (cur.getTime() < end.getTime()) {
    const day = Day.fromDate(cur);
    months.add(day.month);
    dates.push(day);
    if (dates.length === 7) {
      weeks.push(
        new Week(weekIndex++, dates.splice(0, 7), {
          months: [...months.values()],
        })
      );
      months.clear();
    }
    cur = new Date(cur.getTime() + ONE_DAY);
  }
  return weeks;
};

const monthOf = (year, month) => {
  const weeks = sliceYear(year);
  return new Month(year, month, weeks);
};
/**
 *
 * @param {Day} day
 * @returns
 */
const fromDate = (day) => {
  return monthOf(day.year, day.month);
};
export { sliceYear, monthOf, fromDate, Day, CalendarView, CalendarNav };
