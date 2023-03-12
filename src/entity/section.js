export default class Section {
  constructor(section) {
    this._origin = section;
    Object.keys(section).forEach((prop) => {
      this[prop] = section[prop];
    });
  }
  /**
   * 단계별 학습의 [도전] 섹션인티 나타냄
   */
  isChallengeSection() {
    return this.level < 0;
  }
  /**
   * 뭔지 모르겠는데 자꾸 바뀜. 그냥 여기서 formatting함..
   * @returns
   */
  formatDescription() {
    const desc = this.description;
    if (this.isChallengeSection()) {
      /**
       * 단계별 학습 [도전]
       * 앞에 "가.", "나.", "다.".. 붙어있는데 떼어달라고 함
       */
      const p = desc.indexOf(".");
      if (p > 0) {
        return desc.substring(p + 1);
      }
    }
    return desc;
  }
}
