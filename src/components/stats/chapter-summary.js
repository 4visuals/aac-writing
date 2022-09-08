class ChapterSummary {
  constructor(chapter, word, sentence) {
    this.chapter = chapter;
    this.word = word;
    this.sentence = sentence;
  }
  get origin() {
    return this.chapter.origin;
  }
  get desc() {
    const { desc } = this.chapter;
    if (this.chapter.origin === "L") {
      return desc.substring(0, 1);
    } else {
      return desc.substring(3);
    }
  }
  get wordStat() {
    return { ...this.word };
  }
  get senStat() {
    return { ...this.sentence };
  }
  setCorrect(cntWord, cntSen) {
    this.word.correct += cntWord;
    this.sentence.correct += cntSen;
  }
}
export default ChapterSummary;
