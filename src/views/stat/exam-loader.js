import ChapterSummary from "../../components/stats/chapter-summary";

const createExamMap = (exams) => {
  const map = new Map();
  exams.forEach((exam) => {
    let elems = map.get(exam.sectionRef);
    if (!elems) {
      elems = { W: 0, S: 0 };
      map.set(exam.sectionRef, elems);
    }
    /*
     * 차트에 정답 갯수만 표시함
     */
    // const total = exam.numOfQuestions;
    const correct = exam.submissions.filter((sbm) => sbm.correct);
    // const failed = exam.submissions.length - correct;
    // const skipped = total - exam.submissions.length;
    elems[exam.type] += correct.length;
  });
  return map;
};
const createChapterStats = (examMap, chapters) => {
  return chapters.map((chap) => {
    const sentences = chap.sections.flatMap((sec) => sec.sentences);
    const cntS = sentences.filter((sen) => sen.type === "S").length;
    const cntW = sentences.length - cntS;
    const stat = new ChapterSummary(
      chap,
      { total: cntW, correct: 0 },
      { total: cntS, correct: 0 }
    );
    chap.sections.forEach((sec) => {
      const submission = examMap.get(sec.seq);
      if (submission) {
        const { W, S } = submission;
        stat.setCorrect(W, S);
      }
    });
    return stat;
  });
};

export default { createExamMap, createChapterStats };
