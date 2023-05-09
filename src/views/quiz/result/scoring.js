class Trial {
  constructor(question) {
    this.q = question;
  }
  get text() {
    return this.q.text;
  }
  get answer() {
    const { trials } = this.q;
    if (trials.length === 0) {
      return "";
    }
    return trials[0].value;
  }
  get correct() {
    const { trials } = this.q;
    if (trials.length === 0) {
      return false;
    }
    return trials[0].value === this.text;
  }
  get orderInSection() {
    const idx = this.q.numberInSection + 1;
    return (idx < 10 ? "0" : "") + idx;
  }
  get sentence() {
    return this.q.data;
  }
}
class Scoring {
  /**
   *
   * @param {QuizContext} quizContext
   */
  constructor(quizContext) {
    this.ctx = quizContext;
    this.trials = this.ctx.questions.map((q) => new Trial(q));
  }
  getScore() {
    /**
     * #132 오답연습 표기방식 변경
     * https://github.com/4visuals/aac-writing/issues/132
     *
     * 무조건 10개 기준으로 채점함
     */
    // 이전까지 맞춘 문제의 갯수
    const alreadyCorrect = 10 - this.trials.length;
    // 틀린 문제 중 이번에 맞춘 문제의 갯수
    const correct = this.trials.filter((t) => t.correct).length;
    const total = 10; // this.trials.length;

    return (100 * (alreadyCorrect + correct)) / total;
  }
}

export default Scoring;
