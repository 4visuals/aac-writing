import util from "@/service/util";

/**
 * 문장 S를 구성하는 각 어절들을 모두 맞혀야 정답 처리함
 * (오답이 여러개 제출된 후 정답을 맞힌 경우는 최종 오답으로 처리함)
 * @param {Object} paper
 */
const countByEojeols = (paper, section) => {
  const { submissions } = paper;
  // 1. 제출된 어절을 문장, 어절로 분류함
  /*
   * {4: {
   *   12: [...], // 어절 12에 대한 답안들
   *   45: [...]  // 어절 45에 대한 댭안들
   *   }
   * }
   */
  const groups = util.arr.unflat(submissions, {}, (sbm) => [
    sbm.sentenceRef,
    sbm.eojeolRef,
  ]);
  // const section = store.getters["course/section"](paper.sectionRef);
  let sentences = [];
  Object.keys(groups).forEach((senSeq) => {
    const sentence = section.sentences.find((sen) => sen.seq === +senSeq);
    const { eojeols } = sentence;
    // 2. 각 어절마다 정답의 갯수를 센 후
    const corrects = eojeols.reduce((acc, ej) => {
      const trials = groups[senSeq]["" + ej.eojeolRef];
      if (!trials || trials.length === 0) {
        return acc;
      }
      return acc + (trials[0].correct ? 1 : 0);
    }, 0);
    // 3. 문장의 어절 갯수와 정답의 갯수가 같으면 한 문제를 맞췄음.
    if (eojeols.length === corrects) {
      sentences.push(sentence);
    }
  });
  return sentences;
};
const countBySentence = (paper, section) => {
  const groups = util.arr.unflat(paper.submissions, {}, (sbm) => [
    sbm.sentenceRef,
  ]);
  // const section = store.getters["course/section"](paper.sectionRef);
  const corrects = [];
  Object.keys(groups).forEach((senSeq) => {
    const sentence = section.sentences.find((sen) => sen.seq === +senSeq);
    if (groups[senSeq][0].correct) {
      corrects.push(sentence);
    }
  });
  return corrects;
};

const countCorrectAnswer = (paper, section) => {
  const { type, mode } = paper;
  if (type === "S" && mode !== "Q") {
    return countByEojeols(paper, section);
  } else {
    return countBySentence(paper, section);
  }
};
export default countCorrectAnswer;
