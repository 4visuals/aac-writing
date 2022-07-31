import { time } from "@/service/util";
import { quizDao } from "./";

class SectionHistory {
  /**
   * @param sectionSeq pk of section
   * @param type 'W' or 'S'
   * @param mode 'QUIZ'
   */
  constructor(sectionSeq, type, mode) {
    this.sectionSeq = sectionSeq;
    this.type = type;
    this.mode = mode;
    this.solved = 0;
    this.section = null;
    this.stats = {
      word: { solved: 0, total: 0 },
      sentence: { solved: 0, total: 0 },
    };
    this.lastAccessTime = 0;
  }
  get uuid() {
    return `sec-${this.sectionSeq}-${this.type}`;
  }
  get levelText() {
    return this.section.level < 0 ? "도전" : this.section.level;
  }
  get theme() {
    return this.section.level < 0 ? "green" : "pink";
  }
  get typeText() {
    return this.type === "W" ? "낱말" : "문장";
  }
  get desc() {
    return this.section.description;
  }
  get total() {
    return this.section.sentences.filter((sen) => sen.type === this.type)
      .length;
  }
  lacText(cur) {
    return time.diff(cur, this.lastAccessTime);
  }
  ratio(type) {
    const { solved, total } = this.stats[type];
    return `${(100 * solved) / total}%`;
  }
  matched(row) {
    return this.sectionSeq === row.sectionSeq;
  }
  merge(row) {
    const type = row.type === "W" ? "word" : "sentence";
    this.stats[type].solved += row.questions.length;
    this.lastAccessTime = Math.max(this.lastAccessTime, row.startTime);
  }
  setSection(section) {
    const cntW = section.sentences.filter((sen) => sen.type === "W").length;
    const cntS = section.sentences.filter((sen) => sen.type === "S").length;
    this.stats.sentence.total = cntS;
    this.stats.word.total = cntW;
    this.section = section;
  }
}
SectionHistory.create = (row) => {
  const h = new SectionHistory(row.sectionSeq, row.type, row.mode);
  return h;
};

const groupBySections = (rows) => {
  const grouped = [];
  rows.forEach((row) => {
    let history = grouped.find((group) => group.matched(row));
    if (!history) {
      grouped.push((history = SectionHistory.create(row)));
    }
    history.merge(row);
  });
  return grouped;
};

const createHistories = (origin, licenseUUID, sections) => {
  return quizDao.findByLicense(licenseUUID).then((rows) => {
    const quizzes = rows.filter((row) => row.mode === "QUIZ");
    const groups = groupBySections(quizzes);
    groups.forEach((group) => {
      const section = sections.find(
        (sec) => sec.origin === origin && sec.seq === group.sectionSeq
      );
      group.setSection(section);
    });
    return { histories: groups };
  });
};
// export { SectionHistory, groupBySections };

export default {
  createHistories,
};
