import { DELETE, GET, POST, PUT } from "./request";
import Product from "../../entity/product";

const user = {
  membership: (vendor, type, token) =>
    POST(`/user/membership`, { vendor, type, token }),
  join: () => POST(`/user/join`),
  joinManually: (form) => POST("/user/join/manual", form),
  login: () => POST(`/user/login`),
  loginManually: (id, password) => POST("/user/login/manual", { id, password }),
  check: {
    id: (userId) => POST(`/user/prop`, { prop: "userId", value: userId }),
    password: (password) =>
      POST(`/user/prop`, { prop: "pass", value: password }),
  },
  checkPropForJoin: (prop, value) => POST("/user/join/prop", { prop, value }),
};
const student = {
  login: (id, password) =>
    POST(`/student/login`, { id, password, role: "STUDENT" }),
  register: (name, birth, userId, pass, license) =>
    POST(`/student`, { name, birth, userId, pass, license }),
  // update: (studentSeq, props) => PUT(`/student/${studentSeq}`, props),
  updateProp: (studentSeq, prop, value) =>
    PUT(`/student/${studentSeq}`, { studentSeq, prop, value }),
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
   * 주어진 section에 대한 제출 답안 조회
   * @param {int} sectionSeq
   * @param {enum} examMode [R|L|Q]
   * @param {enum} sentenceType [W|S|A]
   * @param {string} licenseUuid
   * @returns
   */
  answers: (sectionSeq, examMode, sentenceType, licenseUuid) =>
    GET(`/answer/section/${sectionSeq}/${examMode}/${sentenceType}`, {
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
/**
 * 상품
 */
const product = {
  list: () =>
    GET("/products").then((res) => {
      {
        res.products = res.products.map((prod) => new Product(prod));
        return res;
      }
    }),
  detail: (search) =>
    GET("/product", search).then((res) => {
      res.product = new Product(res.product);
      return res;
    }),
};
const order = {
  createBeta: (productCode, quantity) =>
    POST("/order/beta", { productCode, quantity }),
  create: (productCode) => POST("/order", { productCode }),
  cancel: (orderUuid) => PUT("/order", { orderUuid }),
  get: (orderUuid) => GET(`/order/${orderUuid}`),
};
const tts = {};

const policy = {
  load: () => GET("/policies"),
  listBy: (policyType) => GET(`/policy/${policyType}/histories`),
  update: (seq, policy) => POST(`/policy`, policy),
};

const setting = {
  password: {
    unlock: (password) => POST("/setting/password/unlock", { password }),
    change: (newPass, curPass) =>
      PUT("/setting/password", { newPass, curPass }),
  },
  unsubscribe: () => DELETE("/setting/unsubscribe"),
};
export { section };

export default {
  user,
  student,
  chapter,
  license,
  section,
  exam,
  stats,
  tts,
  product,
  order,
  policy,
  setting,
};
