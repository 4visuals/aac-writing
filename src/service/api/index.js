import { DELETE, GET, POST, PUT } from "./request";
import Product from "../../entity/product";
import Order from "../../entity/order";

const user = {
  membership: (vendor, type, token) =>
    POST(`/user/membership`, { vendor, type, token }),
  join: () => POST(`/user/join`),
  joinManually: (form) => POST("/user/join/manual", form),
  login: (lcsUuid) => POST(`/user/login`, { license: lcsUuid }),
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
  register: (name, birth, userId, pass, license, randomProps = false) =>
    POST(`/student`, { name, birth, userId, pass, license, randomProps }),
  // update: (studentSeq, props) => PUT(`/student/${studentSeq}`, props),
  updateProp: (studentSeq, prop, value) =>
    PUT(`/student/${studentSeq}`, { studentSeq, prop, value }),
  delete: (studentSeq) => DELETE(`/student/${studentSeq}`),
  getDiagnosis: (studentSeq) =>
    GET(`/diagnosis/student/${studentSeq}`).then(
      (/** @type {diagnosis: any, exams: any[]} */ res) => {
        const { diagnosis, exams } = res;
        const quizes = [...diagnosis.v1, ...diagnosis.v2];
        quizes.forEach((quiz) => {
          if (quiz.answer) {
            const analysis = JSON.parse(quiz.answer.analysis);
            quiz.answer.analysis = analysis;
          }
        });
        exams.forEach((exam) => {
          exam.submissions.forEach((sbm) => {
            if (sbm.analysis) {
              sbm.analysis = JSON.parse(sbm.analysis);
            }
          });
        });
        return res;
      }
    ),
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
  wrongAnswer: (student, sectionSeq) =>
    GET(`/wrong/student/${student}/section/${sectionSeq}`),
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
  getRecords: (studentRef) => GET(`/records/student/${studentRef}`),
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
    GET("/products/retail").then((res) => {
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
  prepare: (orderUuid) => POST(`/order/${orderUuid}/prepare`),
  createBeta: (productCode, quantity) =>
    POST("/order/beta", { productCode, quantity }),
  create: (productCode, delivery, qtt) =>
    POST("/order", {
      productCode,
      delivery: delivery ? delivery.toDto() : undefined,
      qtt,
    }),
  cancel: (orderUuid) => PUT("/order", { orderUuid }),
  get: (orderUuid) => GET(`/order/${orderUuid}`),
  list: () =>
    GET("/orders").then((res) => {
      res.orders.forEach((order) => {
        const tx = order.transactionDetail;
        if (tx) {
          order.transactionDetail = JSON.parse(tx);
        }
      });
      res.orders = res.orders.map((orderDto) => new Order(orderDto));
      return res;
    }),
  group: {
    sendForm: (orderForm) => POST("/group-order/contact", orderForm),
  },
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
/**
 * 진단 평가 관련
 */
const diagnosis = {
  put: (studentSeq, quizSeq, answer) =>
    POST(`/diagnosis/${quizSeq}/student/${studentSeq}`, { answer }).then(
      (answer) => {
        if (answer.analysis) {
          answer.analysis = JSON.parse(answer.analysis);
        }
        return answer;
      }
    ),
  commit: (studentSeq, diagnosisVersion) =>
    PUT(`/diagnosis/student/${studentSeq}`, { version: diagnosisVersion }),
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
  diagnosis,
};
