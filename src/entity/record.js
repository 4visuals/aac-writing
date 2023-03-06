const modeMap = {
  Q: "QUIZ",
  L: "LEARNING",
  R: "READING",
};
/**
 * Section별 최근 시험 기록
 */
export default class Record {
  constructor(recordDto) {
    this._data = recordDto;
    Object.keys(this._data).forEach((prop) => {
      this[prop] = this._data[prop];
    });
  }

  get id() {
    const { type, sectionRef, questionOffset } = this;
    return `record:${sectionRef}-${questionOffset}-${type}`;
  }
  get startTime() {
    return Date.parse(this._data.paper.startTime);
  }

  get mode() {
    return modeMap[this.paper.mode];
  }
}
