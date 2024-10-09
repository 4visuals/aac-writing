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
  levelStart;
  /** @type {number} 1단계 ~ 50 단계*/
  level;
  /** @type {number} number of solved levels */
  solved;
  /** @type {number} total levels */
  total;
  constructor(index, group, levelStart, levelEnd) {
    this.index = index;
    this.group = group;
    this.levelStart = levelStart;
    this.level = levelEnd;
    this.solved = 0;
    this.total = 0;
  }
  get levelEnd() {
    return this.level;
  }
  get webColor() {
    const idx = this.index % colors.length;
    return colors[idx || 0];
  }
  reset() {
    this.solved = 0;
    this.total = 0;
  }
  isEmpty() {
    return this.total === 0;
  }
  /**
   * 소수점 자릿수
   * @param {number} digit (default: 1)
   */
  getPercent(digit = 1) {
    const { solved, total } = this;
    if (this.isEmpty()) {
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
  /** @type {LevelScore[]} */
  chapters;
  constructor(scores) {
    this.scores = scores;
    this.chapters = scores;
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
   * section level(1~50)에 대응하는 LevelScore 맵핑 정보
   * @returns {Map<number, {score: LevelScore,  marks: {solved: number, total: number}[]}}>}
   */
  getLevelMap() {
    let level = 1;
    const markMap = this.scores.reduce((map, score) => {
      while (level < score.level) {
        map.set(level, { score, marks: [] });
        level++;
      }
      map.set(level, { score, marks: [] });
      return map;
    }, new Map());
    return markMap;
  }
  /**
   * section level(1~50)l에 대응하는 chater(가, 나, 다, ...)의 맵핑 반환
   * @return Record<int, string> - key(section level: number), value(chapterName)
   */
  buildSectionMap() {
    let level = 1;
    return this.scores.reduce((map, score) => {
      while (level < score.level) {
        map[level] = score.group;
        level++;
      }
      map[level] = score.group;
      return map;
    }, {});
  }
}

LevelScore.getScoreList = () =>
  new LevelScoreList([
    new LevelScore(0, "가", 1, 4 + 1),
    new LevelScore(1, "나", 4 + 1, 13 + 1),
    new LevelScore(2, "다", 13 + 1, 16 + 1),
    new LevelScore(3, "라", 16 + 1, 22 + 1),
    new LevelScore(4, "마", 22 + 1, 27 + 1),
    new LevelScore(5, "바", 27 + 1, 29 + 1),
    new LevelScore(6, "사", 29 + 1, 32 + 1),
    new LevelScore(7, "아", 32 + 1, 38 + 1),
    new LevelScore(8, "자", 38 + 1, 42 + 1),
    new LevelScore(9, "차", 42 + 1, 50 + 1),
  ]);

export class Marklet {
  /** @type { [number, number]} [solved, total] */
  mark;
  /**
   * @type {[number, number, number]} [year, month, date]
   */
  examTime;
  /**
   * @type {number} sectionSeq
   */
  sectionRef;
  /**
   * @type {number} level number
   */
  level;
  /**
   * @type {number} chapterSeq
   */

  chapterRef;
  constructor(mark, examTime, sectionRef, level, chapterRef) {
    this.mark = mark;
    this.examTime = examTime;
    this.sectionRef = sectionRef;
    this.level = level;
    this.chapterRef = chapterRef;
  }
  get solved() {
    return this.mark[0];
  }
  get total() {
    return this.mark[1];
  }
  /**
   *
   * @param {[number, number, number]} time [year, month, date]
   * @returns
   */
  isSameDate(time) {
    const [year, month] = this.examTime;
    return year === time[0] && month === time[1];
  }
}
export class MarkMap {
  /**
   * @type {Map<number, {score: LevelScore,  marks: {solved: number, total: number}[]}}>}
   */
  map;
  scoreList;
  /**
   * @type {Marklet[]}
   */
  marklets;
  constructor(map) {
    this.map = map;
    this.scoreList = LevelScore.getScoreList();
    this.marklets = [];
  }
  reset() {
    this.map.forEach((entry) => {
      entry.marks = [];
    });
    this.marklets = [];
  }
  /**
   *
   * @param {[number, number, number]} date - [year, month, date]
   * @param {SubmissionResult[]} submissions
   */
  flushSubmissions(date, submissions) {
    const marks = submissions.flatMap((sbm) => Object.entries(sbm.analysis));
    marks.reduce((levelMap, mark) => {
      const [Lnn, score] = mark;
      const lvl = parseInt(Lnn.substring(1));
      levelMap.get(lvl).marks.push(score);
      const scoreData = this.scoreList.scores.find(
        (score) => score.levelStart <= lvl && lvl < score.levelEnd
      );
      scoreData.total += score[1];
      const scoreIndex = this.scoreList.chapters.findIndex(
        (chapterScore) =>
          chapterScore.levelStart <= lvl && lvl < chapterScore.levelEnd
      );
      this.marklets.push(new Marklet(score, date, undefined, lvl, scoreIndex));
      return levelMap;
    }, this.map);
  }
  hasMark(level) {
    const { marks } = this.map.get(level);
    console.log(`level ${level}`, marks.length);
    return marks.length > 0;
  }
  /**
   *
   * @param {number} year
   * @param {number} month - not monthIndex
   */
  hasMarkByDate(year, month) {
    const found = this.marklets.find(({ examTime }) => {
      return examTime[0] === year && examTime[1] === month;
    });
    return !!found;
  }
  /**
   *
   * @param {(marketlet: Marklet) => boolean} fnPredicate
   * @returns {Marklet[]}
   */
  filterBy(fnPredicate) {
    return this.marklets.filter(fnPredicate);
  }
  /**
   *
   * @param {LevelScoreList} scoreList
   * @returns {MarkMap}
   */
  static buildMarkMap(scoreList) {
    let level = 1;
    const marks = scoreList.scores.reduce((map, score) => {
      while (level < score.level) {
        map.set(level, { score, marks: [] });
        level++;
      }
      map.set(level, { score, marks: [] });
      return map;
    }, new Map());

    return new MarkMap(marks);
  }
}
