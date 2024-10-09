import { arr } from "../../../service/util";

const getYmdText = (ymd) => {
  let [year, month, day] = ymd;
  month = month < 10 ? "0" + month : month;
  day = day < 10 ? "0" + day : day;

  return `${year}-${month}-${day}`;
};
export class LevelScore {
  /**
   * @type {Record<string: [number, number]>[]}
   */
  marks;
  constructor(marks) {
    this.marks = marks;
  }
}
/**
 * 퀴즈 별 제출 답안 상세 내용
 */
export class SubmissionResult {
  /** @type {boolean} 정답여부 */
  correct;
  /** @type {number} millis*/
  elapsedTimeMillis;
  /** @type {number} FK to exam paper */
  examRef;
  /** @type {number} FK to sectence */
  sentenceRef;
  /**
   * @type {string} 학생이 입력한 답안
   */
  value;
  /**
   * level마다 [score, total] 의 구조로 이루어짐
   * @type {{L01: [number, number], L50: [number, number]}}
   */
  analysis;
  constructor(
    correct,
    elapsedTimeMillis,
    examRef,
    sentenceRef,
    value,
    analysis
  ) {
    this.correct = correct;
    this.elapsedTimeMillis = elapsedTimeMillis;
    this.examRef = examRef;
    this.sentenceRef = sentenceRef;
    this.value = value;
    this.analysis = analysis;
  }
}
SubmissionResult.fromDto = (dto) => {
  const { correct, elapsedTimeMillis, examRef, sentenceRef, value, analysis } =
    dto;
  return new SubmissionResult(
    correct,
    elapsedTimeMillis,
    examRef,
    sentenceRef,
    value,
    analysis
  );
};

export class ExamPaper {
  seq;
  ageInMonth;
  endTime;
  mode;
  numOfQuestions;
  origin;
  questionOffset;
  retry;
  sectionRef;
  startTime;
  studentRef;
  /**
   * @type {SubmissionResult[]}
   */
  submissions;
  constructor(
    seq,
    ageInMonth,
    endTime,
    mode,
    numOfQuestions,
    origin,
    questionOffset,
    retry,
    sectionRef,
    startTime,
    studentRef
  ) {
    this.seq = seq;
    this.ageInMonth = ageInMonth;
    this.endTime = endTime;
    this.mode = mode;
    this.numOfQuestions = numOfQuestions;
    this.origin = origin;
    this.questionOffset = questionOffset;
    this.retry = retry;
    this.sectionRef = sectionRef;
    this.startTime = new Date(startTime);
    this.studentRef = studentRef;
  }
  getYmdText() {
    const { startTime } = this;
    const year = startTime.getFullYear();
    const month = startTime.getMonth() + 1;
    const date = 1;
    return getYmdText([year, month, date]);
  }
}
/**
 *
 * @param {unknown} dto
 * @returns {ExamPaper}
 */
ExamPaper.fromDto = (dto) => {
  const {
    seq,
    ageInMonth,
    endTime,
    mode,
    numOfQuestions,
    origin,
    questionOffset,
    retry,
    sectionRef,
    startTime,
    studentRef,
  } = dto;
  const paper = new ExamPaper(
    seq,
    ageInMonth,
    endTime,
    mode,
    numOfQuestions,
    origin,
    questionOffset,
    retry,
    sectionRef,
    startTime,
    studentRef
  );
  paper.submissions = dto.submissions.map((sbm) =>
    SubmissionResult.fromDto(sbm)
  );
  return paper;
};
export class StudentExamList {
  /**
   * @type {ExamPaper[]}
   */
  papers;
  constructor(papers) {
    this.papers = papers;
  }
  mapBy(fnPaperFilter) {
    const papers = this.papers.filter(fnPaperFilter);
    return new StudentExamList(papers);
  }
  /**
   *
   * @param {Date} recent 기준 시간
   * @param {*} numOfMonth recent로부터 조회할 달. 12 이면 recent에서 1년치 과거 데이터를 의미함
   * @returns {{date: [number, number, number], submissions: SubmissionResult[] }[]}
   */
  getValuesByMonth(recent, numOfMonth = 12) {
    const date = recent || new Date();
    date.setDate(1);
    /** @type {number[][number, number, number]} */
    let monthsList = [];

    for (let i = 0; i < numOfMonth; i++) {
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      monthsList.unshift([year, month, 1]);
      date.setMonth(date.getMonth() - 1);
    }
    const map = arr.groupByMap(
      this.papers,
      (/** @type {ExamPaper} */ paper) => paper.getYmdText(),
      () => [],
      (values, paper) => values.push(...paper.submissions)
    );
    return monthsList.map((ymd1) => ({
      date: ymd1,
      submissions: map.get(getYmdText(ymd1)) || [],
    }));
  }
  /**
   *
   * @param {import('./level-score').LevelScoreList} scoreMap
   * @returns {Map<string, SubmissionResult[]>} submissions by chapterName(가, 나, 다, ..)
   */
  getValueByChapter(scoreMap, fnSectionGetter) {
    const sectionMap = scoreMap.buildSectionMap();
    const { papers } = this;
    const submissions = this.getSubmissions();
    const map = arr.groupByMap(
      submissions,
      (sbm) => {
        const paper = papers.find((paper) => paper.seq === sbm.examRef);
        const section = fnSectionGetter(paper.sectionRef);
        return section ? sectionMap[section.level] : "none";
      },
      () => [],
      (list, sbm) => list.push(sbm)
    );
    map.delete("none"); // 종합 평가는 제외함
    return map;
  }
  getSubmissions() {
    return this.papers.flatMap((paper) => paper.submissions);
  }
  getRecentDate() {
    const anyPaper = this.papers[0];
    const date = this.papers.reduce(
      (recent, paper) => {
        const { startTime } = paper;
        const found = startTime.getTime() > recent.getTime();
        return found ? startTime : recent;
      },
      anyPaper ? anyPaper.startTime : new Date()
    );
    return new Date(date);
  }
}
/**
 *
 * @param {ExamPaper[]} examDtoList
 * @returns
 */
StudentExamList.parse = (examDtoList) => {
  const exams = examDtoList.map((dto) => ExamPaper.fromDto(dto));
  return new StudentExamList(exams);
};
