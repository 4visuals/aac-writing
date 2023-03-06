import storage from "@/service/storage";

class QuizSpec {
  /**
   * quizMode - 보고쓰기('READING'), 연습하기('LEARNING'), 받아쓰기('QUIZ'), 듣고쓰기('LISTEN') 모드
   * answerType -  정답 입력 컴포넌트 종류. 어절 선택('EJ') or 받아쓰기('SEN') 없음('NULL')
   * section - secion sequence(number)
   * quizResource - 'S'(문장) or 'W'(낱말) or 'A'(교과서, 문장으로 해석)
   * prevPage - 퀴즈 종료 후 복귀할 화면 정보
   * seqs - 퀴즈를 구성하는 sentence sequence 의 배열
   * ranges - [start, end) section 내에서 문제의 범위
   * retry - 틀린 문제만 풀고 있음.
   *
   * @param {{quizMode: String,
   *  answerType: String,
   *  section: Number,
   *  quizResource: String,
   *  prevPage: Object,
   *  seqs: [Number],
   *  ranges:[Number],
   * retry: Boolean}} spec - 퀴즈 스펙
   */
  constructor({
    quizMode,
    answerType,
    section,
    quizResource,
    prevPage,
    seqs,
    ranges,
    retry,
  }) {
    this.quizMode = quizMode;
    this.answerType = answerType;
    this.section = section;
    this.quizResource = quizResource;
    this.prevPage = prevPage;
    this.seqs = seqs;
    this.ranges = ranges;
    this.retry = retry || false;
  }
  write() {
    storage.session.write("quizSpec", this);
  }
  reload(section, ranges, sentenceFilter, retry) {
    retry = retry === undefined ? this.retry : retry;
    this.retry = retry;
    return new Promise((resolve) => {
      this.section = section.seq;
      this.seqs = sentenceFilter().map((sen) => sen.seq);
      this.ranges = ranges;
      this.write();
      resolve();
    });
  }
}

const prepareQuiz = (
  quizMode,
  answerType,
  section,
  quizResource,
  prevPage,
  seqs,
  ranges,
  retry = false
) =>
  new Promise((resolve, reject) => {
    if (seqs.length === 0) {
      reject({ cause: "NO_QUIZ", resource: quizResource });
      return;
    }
    const spec = new QuizSpec({
      quizMode,
      answerType,
      section,
      quizResource,
      prevPage,
      seqs,
      ranges,
      retry,
    });
    spec.write();
    resolve();
  });

/**
 * 교과서 퀴즈 생성
 * @param {String} quizMode - 보고쓰기('READING'), 연습하기('LEARNING'), 받아쓰기('QUIZ'), 듣고쓰기('LISTEN')
 * @param {String} answerType - 'SEN'(문장 입려기), 'EJ'(어절 입력기), 'NULL'(없음)
 * @param {object} section
 * @param {Function} sentenceFilter
 * @param {Array<Number>} ranges
 * @returns {Promise}
 */
QuizSpec.prepareBookQuiz = (
  quizMode,
  answerType,
  section,
  sentenceFilter,
  ranges,
  retry = false
) => {
  const quizResource = "A";
  if (quizMode === "LISTEN") {
    // 듣고쓰기인 경우 정답 입력기를 사용하지 않음
    answerType = "NULL";
  } else {
    answerType = { comp: answerType, pumsa: "what" };
  }
  const prevPage = {
    chapter: "BookListingView",
    section: `/book/section`,
  };
  const seqs = sentenceFilter(section).map((sen) => sen.seq);
  return prepareQuiz(
    quizMode,
    answerType,
    section.seq,
    quizResource,
    prevPage,
    seqs,
    ranges,
    retry
  );
};
/**
 * 새로운 단계별 학습 퀴즈를 준비함.
 *
 * @param {String} quizMode - 'READING', 'LEARNING', 'QUIZ', 'LISTEN'
 * @param {String} answerType
 * @param {Object} section
 * @param {String} quizResource
 * @param {Function} sentenceFilter
 * @param {[Number]} ranges
 * @param {Boolean} retry - 틀린 문제 재시도인지 나타냄
 * @returns
 */
QuizSpec.prepareLevelQuiz = (
  quizMode,
  answerType,
  section,
  quizResource,
  sentenceFilter,
  ranges,
  retry
) => {
  /*
   * 낱말인 경우 무조건 낱말 입력기를 사용함
   */
  if (quizMode === "LISTEN") {
    // 듣고쓰기인 경우 정답 입력기를 사용하지 않음
    answerType = "NULL";
  } else {
    answerType = quizResource === "W" ? "SEN" : answerType;
  }

  const prevPage = {
    chapter: "LevelListingView",
    section: `/level/section`,
  };
  const seqs = sentenceFilter(section).map((sen) => sen.seq);
  return prepareQuiz(
    quizMode,
    answerType,
    section.seq,
    quizResource,
    prevPage,
    seqs,
    ranges,
    retry
  );
};

QuizSpec.loadQuizSpec = () => {
  const obj = storage.session.read("quizSpec");
  return new QuizSpec(obj);
};

export default QuizSpec;
