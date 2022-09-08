import { GET, POST, PUT } from "./request";

const user = {
  membership: (vendor, type, token) =>
    POST(`/user/membership`, { vendor, type, token }),
  join: () => POST(`/user/join`),
  login: () => POST(`/user/login`),
};
const student = {
  login: (id, password) =>
    POST(`/student/login`, { id, password, role: "STUDENT" }),
  register: (name, birth, userId, pass, license) =>
    POST(`/student`, { name, birth, userId, pass, license }),
  update: (studentSeq, props) => PUT(`/student/${studentSeq}`, props),
};
const chapter = {
  list: (origin) => GET(`/chapters/origin/${origin}`),
};
const section = {
  levels: () => GET("/dictations/level"),
  /**
   *
   * @param {int} sectionSeq
   * @param {Origin} type 'S'|'W'
   * @returns
   */
  sentences: (sectionSeq, type) => GET(`/section/${sectionSeq}/${type}`),
};

const license = {
  bind: (licenseSeq, studentSeq) =>
    PUT(`/license/${licenseSeq}/student/${studentSeq}`),
};

const exam = {
  submitExam: (exam) => POST(`/exam/quiz`, exam),
  submitLearning: (exam) => POST(`/exam/learning`, exam),
  /**
   *
   * @param {int} sectionSeq
   * @param {enum} sentenceType [W|S|A]
   * @param {string} licenseUuid
   * @returns
   */
  querySectionQuiz: (sectionSeq, sentenceType, licenseUuid) =>
    GET(`/exam/quiz/section/${sectionSeq}`, {
      sentenceType,
      license: licenseUuid,
    }),
  /**
   * 주어진 라이선스로 시도한 전체 학습 이력
   * @param {string} licenseUuid
   * @returns
   */
  queryExams: (licenseUuid) => GET("/exams", { license: licenseUuid }),
  /**
   * 각 section segment마다 최근 시험 정보를 반환
   * @param {string} licenseUuid 시험에 사용한 라이선스
   * @returns
   */
  queryBySegments: (licenseUuid) =>
    GET("/exams/segments", { license: licenseUuid }),
};
/**
 * 통계 관련 요청
 */
const stats = {
  /**
   *
   * @param {string} type 기준: ['student']
   * @param {object} value type에 대한 값(type이 'student'인 경우 seq)
   * @returns
   */
  sections: (type, value) => GET(`/stats/sections/${type}/${value}`),
  bySection: (sectionSeq, licenseUuid) =>
    GET(`/stats/section/${sectionSeq}`, { license: licenseUuid }),
};

const tts = {};

export { section };

export default { user, student, chapter, license, section, exam, stats, tts };
