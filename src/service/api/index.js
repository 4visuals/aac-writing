import { GET, POST, PUT } from "./request";

const user = {
  membership: (vendor, type, token) =>
    POST(`/user/membership`, { vendor, type, token }),
  join: () => POST(`/user/join`),
  login: () => POST(`/user/login`),
};
const student = {
  register: (name, birth) => POST(`/student`, { name, birth }),
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
};

const tts = {};

export { section };

export default { user, student, chapter, license, section, exam, stats, tts };
