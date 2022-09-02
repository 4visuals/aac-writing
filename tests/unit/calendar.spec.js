import { expect } from "chai";
import { sliceYear, monthOf } from "../../src/components/calendar";

describe("2022 years", () => {
  it("checks first day and last daa", () => {
    const weeks = sliceYear(2022);

    const firstWeek = weeks[0];
    expect([12, 1]).deep.to.equal(firstWeek.months);
    expect("2021-12-26").to.equal(firstWeek.dayOf(0).toYMD());

    const lastWeek = weeks.reverse()[0];
    expect([12]).deep.to.equal(lastWeek.months);
    expect("2022-12-25").to.equal(lastWeek.dayOf(0).toYMD());
    expect("2022-12-31").to.equal(lastWeek.dayOf(6).toYMD());
  });
  it("2022년 9월", () => {
    /*
     * 28, 29, 30, 31, 1, 2, 3
     */
    const sep = monthOf(2022, 9);
    // 2022년 9월
    const weeksOfSep = sep.currentWeeks;
    const firstDay = weeksOfSep[0].dayOf(0);
    expect("2022-8-28").to.equals(firstDay.toYMD());
    expect("일").to.equals(firstDay.dayText);

    const lastDay = weeksOfSep[4].dayOf(6);
    expect("2022-10-1").to.equals(lastDay.toYMD());
    expect("토").to.equal(lastDay.dayText);
  });
});

describe("이전달 다음달 이동", () => {
  const m9 = monthOf(2022, 9);
  it("2022년 8월이어야 함", () => {
    const m8 = m9.prevMonth();
    expect(2022, m8.year);
    expect(8, m8.month);
    expect("2022-8-31", m8.currentWeeks[4].dayOf(6).toYMD());
  });
  it("2022년 10월이어야 함", () => {
    const m10 = m9.nextMonth();
    expect("2022-10-1", m10.currentWeeks[0].dayOf(0).toYMD());
  });
  it("2022년 12월의 다음 달은 2023년 1월", () => {
    const m01 = monthOf(2022, 12).nextMonth();
    expect(2023, m01.year);
    expect(1, m01.month);
    expect("2023-1-1", m01.currentWeeks[0].dayOf(0).toYMD());
    expect("일", m01.currentWeeks[0].dayOf(0).dayText);
  });
  it("2022년 1월의 이전 달은 2021년 12월", () => {
    const m12 = monthOf(2022, 1).prevMonth();
    expect(2021, m12.year);
    expect(12, m12.month);
    expect("2021-12-1", m12.currentWeeks[0].dayOf(0).toYMD());
    expect("수", m12.currentWeeks[0].dayOf(0).dayText);
  });
});
