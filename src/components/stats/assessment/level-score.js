const colors = [
  "#4CAF50", // Green
  "#2196F3", // Blue
  "#FFC107", // Amber
  "#FF5722", // Deep Orange
  "#9C27B0", // Purple
  "#3F51B5", // Indigo
  "#00BCD4", // Cyan
  "#8BC34A", // Light Green
  "#FF9800", // Orange
  "#E91E63", // Pink
];
export class LevelScore {
  /** @type {number} index(zero based) */
  index;
  /** @type {string} '가'~'차` */
  group;
  /** @type {number} */
  level;
  /** @type {number} number of solved levels */
  solved;
  /** @type {number} total levels */
  total;
  constructor(index, group, level) {
    this.index = index;
    this.group = group;
    this.level = level;
    this.solved = 0;
    this.total = 0;
  }
  get webColor() {
    const idx = this.index % colors.length;
    return colors[idx || 0];
  }
  reset() {
    this.solved = 0;
    this.total = 0;
  }
  /**
   * 소수점 자릿수
   * @param {number} digit (default: 1)
   */
  getPercent(digit = 1) {
    const { solved, total } = this;
    if (total === 0) {
      return 0;
    } else {
      const percent = (solved / total) * 100;
      const decimal = Math.pow(10, digit);
      return parseInt(percent * decimal) / decimal;
    }
  }
}

export class LevelScoreList {
  /** @type {LevelScore[]} */
  scores;
  constructor(scores) {
    this.scores = scores;
  }
  get length() {
    return this.scores.length;
  }
  at(index) {
    return this.scores[index];
  }
  map(fnMapper) {
    return this.scores.map(fnMapper);
  }
  reset() {
    this.scores.forEach((score) => {
      score.reset();
    });
  }
  /**
   * section 번호에 대응하는 chater(가, 나, 다, ...)의 맵핑 반환
   * @return Record<int, string> - key(sectionSeq), value(chapterName)
   */
  buildSectionMap() {
    let limit = 1;
    return this.scores.reduce((map, score) => {
      while (limit < score.level) {
        map[limit] = score.group;
        limit++;
      }
      map[limit] = score.group;
      return map;
    }, {});
  }
}

LevelScore.getScoreList = () =>
  new LevelScoreList([
    new LevelScore(0, "가", 5),
    new LevelScore(1, "나", 13),
    new LevelScore(2, "다", 16),
    new LevelScore(3, "라", 22),
    new LevelScore(4, "마", 27),
    new LevelScore(5, "바", 29),
    new LevelScore(6, "사", 32),
    new LevelScore(7, "아", 38),
    new LevelScore(8, "자", 42),
    new LevelScore(9, "차", 50),
  ]);
