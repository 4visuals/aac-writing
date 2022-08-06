import { expect } from "chai";
import util from "../../src/service/util";

describe("time diff", () => {
  it("ddd", () => {
    const cur = new Date().getTime();
    const after = cur + 10 * 1000;
    expect(util.time.diff(cur, after)).to.equal("10 초");
  });
});

describe("time range", () => {
  it("7월 29일부터 최근 일주일(23~29)", () => {
    const cur = new Date("2022-07-29T09:00:00"); // fryday
    const ranges = util.time.range(cur, "7 day");
    console.log(ranges);
    expect(ranges[0].text).to.equal("2022-07-23");
  });

  it("7월 29일이 속한 일주일(25~30)", () => {
    const cur = new Date("2022-07-29T09:00:00"); // fryday
    const ranges = util.time.weekRange(cur);
    console.log(ranges);
    expect(ranges.length).to.equals(7);
    expect(ranges[0].text).to.equal("2022-07-24");
    expect(ranges[6].text).to.equal("2022-07-30");
  });
  it("7월 한달(1~31)", () => {
    const cur = new Date("2022-07-31T09:00:00");
    const ranges = util.time.monthRange(cur);
    expect(ranges.length).to.equal(31);
    expect(ranges[0].text).to.equal("2022-07-01");
    expect(ranges[30].text).to.equal("2022-07-31");
  });
});
