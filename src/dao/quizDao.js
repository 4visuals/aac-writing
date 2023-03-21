import { logger } from "@/service/util";

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
    // console.log("[EXISTING]", row);
    /**
     * 이전에 풀었던 segment를 삭제 후 새로 넣음.
     */
    await this.db.quizzes.delete([
      license.uuid,
      sectionSeq,
      type,
      mode,
      ranges,
    ]);
    this.db[tableName].put({
      license: license.uuid,
      sectionSeq,
      type,
      mode,
      ranges,
      questions: [],
      startTime: quizContext.startTime,
    });
  }
  saveQuiz(quizContext) {
    if (!quizContext) {
      return Promise.resolve(false);
    }
    if (!quizContext.isQuizMode()) {
      // 일단 퀴즈일때만
      return Promise.resolve(false);
    }
    logger.log("[save]", quizContext);
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
    /**
     * 다 푼것만 이력에 남겨달라고 함
     * https://github.com/4visuals/aac-writing/issues/123
     *
     * 기존에는 이력을 넣은 후에 questions만 업데이트했었음.
     */
    return this.db[tableName].put({
      license: license.uuid,
      sectionSeq,
      type,
      mode,
      ranges,
      questions,
      startTime: quizContext.startTime,
    });
    /*
    return this.db[tableName]
      .where(cols)
      .equals([license.uuid, sectionSeq, type, mode, ranges])
      .modify({ questions });
  */
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
