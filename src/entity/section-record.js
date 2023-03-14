export default class SectionRecord {
  /**
   *
   * @param {number} sectionSeq
   * @param { import("./record").default[] } records
   */
  constructor(sectionSeq, records = []) {
    this.sectionSeq = sectionSeq;
    this.records = records;
  }
  add(record) {
    this.records.push(record);
  }
  isPerfect(section, type) {
    if (section.seq !== this.sectionSeq) {
      throw new Error(
        `Not a section of seq [${this.sectionSeq}], but ${section.seq}`
      );
    }
    const sentences = section.sentences.filter((sen) => sen.type === type);
    const corrects = this.records
      .filter((record) => record.type === type)
      .reduce((acc, record) => acc + record.numOfCorrectAnswer, 0);
    /**
     * 교과서의 경우 낱말이 없으므로 둘다 0으로 나옴.
     */
    return sentences.length > 0 && sentences.length === corrects;
  }
}
