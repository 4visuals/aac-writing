const tableName = "quizzes";
const cols = "license,sectionSeq,type,mode,ranges".split(",");

const toRangeId = (quizContext) => {
  const { ranges } = quizContext;
  // return `${ranges[0]}_${ranges[1]}`;
  return JSON.parse(JSON.stringify(ranges));
};
class QuizDao {
  constructor(db, operations) {
    this.db = db;
    this.operations = operations;
    this.operations.createTable(tableName, `[${cols.join("+")}]`);
    this.operations
      .createTable(tableName, `[${cols.join("+")}]`, 2)
      .upgrade((tx) => {
        const cur = new Date();
        tx.table(tableName)
          .toCollection()
          .modify((row) => {
            if (!row.startTime) {
              const dummyTime = cur.getTime() - 1 * 24 * 60 * 60 * 1000;
              row.startTime = dummyTime;
            }
          });
      });
  }
  findBy() {
    return this.db[tableName].toArray();
  }
  findByLicense(lcsUuid) {
    return this.db[tableName].where("license").equals([lcsUuid]).toArray();
  }
  findByQuiz(license, sectionSeq, type, mode) {
    const where = cols.slice(0, cols.length - 1);
    return this.db[tableName]
      .where(where)
      .equals([license, sectionSeq, type, mode])
      .toArray();
  }
  findSection(section) {
    return this.db[tableName]
      .where(["sectionSeq"])
      .equals([section.seq])
      .toArray();
  }
  async sync(quizContext) {
    const { license, sectionSeq } = quizContext;
    const type = quizContext.isWord() ? "W" : "S";
    const mode = quizContext.mode;
    const ranges = toRangeId(quizContext);
    // const row = await this.db.quizzes.get([
    //   license.uuid,
    //   sectionSeq,
    //   type,
    //   mode,
    //   ranges,
    // ]);

    const cnt = await this.db.quizzes.delete([
      license.uuid,
      sectionSeq,
      type,
      mode,
      ranges,
    ]);
    console.log("deleted:", cnt);
    // if (row) {
    //   console.log("[found]", row);
    // } else {
    // }
    this.db[tableName].put({
      license: license.uuid,
      sectionSeq,
      type,
      mode,
      ranges,
      questions: [],
      startTime: quizContext.startTime,
    });
    // console.log(res);
  }
  async saveQuiz(quizContext) {
    console.log("[save]", quizContext);
    if (!quizContext) {
      return;
    }
    if (!quizContext.isQuizMode()) {
      // 일단 퀴즈일때만
      return;
    }
    const { license, sectionSeq } = quizContext;
    const type = quizContext.isWord() ? "W" : "S";
    const mode = quizContext.mode;
    const questions = quizContext.questions
      .filter((questions) => questions.trials.length > 0)
      .map((question) => ({
        dataRef: question.data.seq,
        trials: JSON.parse(JSON.stringify(question.trials)),
        solved: question.solved,
      }));
    const ranges = toRangeId(quizContext);
    this.db[tableName]
      .where(cols)
      .equals([license.uuid, sectionSeq, type, mode, ranges])
      .modify({ questions });
    // .modify({ questions: JSON.stringify(questions) });
  }
  async deleteQuiz(quizContext) {
    console.log("[DELETE]", quizContext);
  }
  deleteBySection(props) {
    const values = Object.values(props);
    return this.db[tableName].where(cols.slice(0, 2)).equals(values).delete();
  }
}

export default QuizDao;
