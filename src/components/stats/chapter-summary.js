import util from "../../service/util";
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
    if (this.chapter.origin === "L") {
      return util.chapter.rangeText(this.chapter);
    } else {
      // 앞에 "국어 "를 떼어냄
      return this.chapter.desc.substring(3);
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
