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
  submit: (exam) => POST(`/exam`, exam),
};

export { section };

export default { user, student, chapter, license, section, exam };
