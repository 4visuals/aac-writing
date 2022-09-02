/**
 * 퀴즈(시험) 정보 관리
 */
import api from "@/service/api";
import storage from "@/service/storage";

class ExamSession {
  constructor(license) {
    this.license = license;
  }
}

export default {
  namespaced: true,
  state: () => ({ session: null, activeLicense: null, histories: null }),
  getters: {
    activeLicense: (state) => state.activeLicense,
    student: (state, getters, allState, allGetters) => {
      const studentSeq = state.activeLicense.studentRef;
      const students = allGetters["user/students"];
      return students.find((stud) => stud.seq === studentSeq);
    },
  },
  mutations: {
    /**
     *
     * @param {Vuex.State} state
     * @param {{license, quiz}} args
     */
    createSession(state, args) {
      const { license, quiz } = args;
      state.session = new ExamSession(license, quiz);
    },
    setActiveLicense(state, license) {
      state.activeLicense = license;
      storage.local.write("active_license", license);
    },
    initLicense(state) {
      const license = storage.local.read("active_license");
      state.activeLicense = license;
    },
    clear(state) {
      state.activeLicense = null;
      storage.local.remove("active_license");
    },
    setExamHistories(state, { sections, papers }) {
      const byMonth = new Map();
      const sectionMap = new Map();
      sections.forEach((sec) => {
        sectionMap.set(sec.seq, sec);
      });
      papers.forEach((paper) => {
        const ym = paper.ymd.substring(0, "yyyy-mm".length);
        const { sectionRef } = paper;
        const section = sectionMap.get(sectionRef);
        paper.origin = section.origin;
        let exams = byMonth.get(ym);
        if (!exams) {
          exams = [];
          byMonth.set(ym, exams);
        }
        exams.push(paper);
      });
      state.histories = byMonth;
    },
  },
  actions: {
    queryExams(ctx) {
      const license = ctx.getters["activeLicense"];
      api.exam.queryExams(license.uuid).then((res) => {
        const { papers, learnings } = res;
        // papers.forEach((paper) => {
        //   paper.mode = "QUIZ";
        // });
        // learnings.forEach((learning) => {
        //   learning.mode = "LEARNING";
        // });
        // 같이 합침
        papers.push(...learnings);
        const sections = ctx.rootGetters["course/sections"];
        ctx.commit("setExamHistories", { papers, sections });
      });
    },
  },
};
