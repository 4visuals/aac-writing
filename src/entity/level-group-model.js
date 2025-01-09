export class LevelColumnModel {
  columns;
  constructor(level = 50) {
    this.columns = [];
    for (let i = 0; i < level; i++) {
      this.columns.push({ text: (i < 9 ? "0" : "") + (i + 1), level: i + 1 });
    }
  }
}
export class SentenceGroupModel {
  /** @type {LevelColumnModel} */
  colModel;
  sentences;
  colsums;
  modif;
  key;
  constructor(colModel, sentences) {
    this.key = Math.random().toString(36).substring(2);
    this.colModel = colModel;
    this.sentences = sentences;
    this.colsums = colModel.columns.map(() => 0);
  }
  captureDifficulty(difficulty) {
    this.colsums.forEach((_, idx) => {
      this.colsums[idx] = 0;
    });
    this.sentences.forEach((sen) => {
      this.colModel.columns.forEach((column, idx) => {
        let levels = difficulty[sen.seq];
        if (this.modif) {
          const mf = this.modif.find((mf) => mf.sentence.seq === sen.seq);
          if (mf) {
            levels = mf.dfMap[0];
          }
        }
        const prop = "L" + column.text;
        const ranges = levels[prop];
        const qtt = ranges && ranges.length > 0 ? ranges.length : 0;
        this.colsums[idx] += qtt;
      });
    });
    console.log(this.colsums);
  }
  countByLevel(difficulty, sen, column) {
    if (!difficulty) {
      return "";
    }
    let levels;
    if (this.modif) {
      const mf = this.modif.find((mf) => mf.sentence.seq === sen.seq);
      if (mf) {
        levels = mf.dfMap[0];
      }
    }
    if (!levels) {
      levels = difficulty[sen.seq];
    }
    if (!levels) {
      return "";
    }
    const prop = "L" + column.text;
    const ranges = levels[prop];
    return ranges && ranges.length > 0 ? ranges.length : "";
  }
  getText(sen) {
    let text = sen.sentence;
    if (this.modif) {
      const mf = this.modif.find((mf) => mf.sentence.seq === sen.seq);
      if (mf) {
        return mf.value;
      }
    }
    return text;
  }
  isModified(sen) {
    if (this.modif) {
      const mf = this.modif.find((mf) => mf.sentence.seq === sen.seq);
      return !!mf;
    }
    return false;
  }
  setModification(modif, difficulty) {
    this.modif = modif;
    this.key = Math.random().toString(36).substring(2);
    this.captureDifficulty(difficulty);
    console.log("[]", this.modif);
  }
  static group(section) {
    const sentences = [...section.sentences];
    const model = new LevelColumnModel(50);
    const groups = [];
    while (sentences.length >= 10) {
      groups.push(new SentenceGroupModel(model, sentences.splice(0, 10)));
    }
    if (sentences.length > 0) {
      groups.push(sentences);
    }
    return groups;
  }
}
