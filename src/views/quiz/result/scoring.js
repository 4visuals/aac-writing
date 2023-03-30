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
    const total = this.trials.length;
    const correct = this.trials.filter((t) => t.correct).length;
    return (100 * correct) / total;
  }
}

export default Scoring;
