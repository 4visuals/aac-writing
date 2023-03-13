/**
 * 퀴즈(시험) 정보 관리
 */
import { time } from "@/service/util";
import api from "@/service/api";
import storage from "@/service/storage";
import ChapterSummary from "@/components/stats/chapter-summary";
import License from "../../entity/license";

class ExamSession {
  constructor(license) {
    this.license = license;
  }
}

const createSegmentMap = (exams) => {
  const map = new Map();
  exams.forEach((exam) => {
    let elems = map.get(exam.sectionRef);
    if (!elems) {
      elems = { section: exam.sectionRef, W: 0, S: 0 };
      map.set(exam.sectionRef, elems);
    }
    const correct = exam.submissions.filter((sbm) => sbm.correct);
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

export default {
  namespaced: true,
  state: () => ({
    session: null,
    activeLicense: null,
    histories: null,
    segmentHistory: null,
  }),
  getters: {
    activeLicense: (state) => state.activeLicense,
    student: (state, getters, allState, allGetters) => {
      const studentSeq = state.activeLicense?.studentRef;
      const students = allGetters["user/students"];
      return students.find((stud) => stud.seq === studentSeq);
    },
    segmentHistory: (state) => state.segmentHistory,
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
      if (license) {
        state.activeLicense = new License(license);
      } else {
        state.activeLicense = null;
      }
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
    setSegmentHistories(state, segments) {
      const levels = this.getters["course/levels"];
      const books = this.getters["course/books"];
      const segMap = createSegmentMap(segments);
      const level = createChapterStats(segMap, levels);
      const book = createChapterStats(segMap, books);
      state.segmentHistory = { segMap, level, book, segments };
    },
  },
  actions: {
    loadLicense(ctx) {
      ctx.commit("initLicense");
      return ctx.getters["activeLicense"];
    },
    queryExams(ctx) {
      const license = ctx.getters["activeLicense"];
      api.exam.queryExams(license.uuid).then((res) => {
        const { papers, learnings } = res;
        papers.push(...learnings);
        papers.forEach((paper) => {
          // FIXME 서버의 timezone이 한국 시간이 아니면 9시간을 더하지 않은 날짜로 지정됨
          paper.ymd = time.toYMD(paper.startTime);
        });
        const sections = ctx.rootGetters["course/sections"];
        ctx.commit("setExamHistories", { papers, sections });
      });
    },
  },
};
