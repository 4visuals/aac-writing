import api from "@/service/api";
import Record from "../../entity/record";

export default {
  namespaced: true,
  state: () => ({ records: new Map(), mod: 0 }),
  getters: {
    wrongAnswers: (state) => (section) => {
      if (!section) {
        return [];
      }
      const { seq } = section;
      return [...state.records.values()].filter(
        (record) => record.sectionRef === seq && record.numOfWrongAnswer > 0
      );
    },
    records: (state) => [...state.records.values()],
  },
  mutations: {
    updateRecord: (state, { records, clear }) => {
      if (clear) {
        state.records.clear();
      }
      records.forEach((elem) => {
        const record = new Record(elem);
        state.records.set(record.id, record);
      });
      if (clear || records.length > 0) {
        state.mod++;
      }
    },
  },
  actions: {
    prefetch: (ctx, studentRef) => {
      return api.exam.getRecords(studentRef).then((res) => {
        ctx.commit("updateRecord", { records: res.papers, clear: true });
      });
    },
    loadRecord: (ctx, sectionSeq) => {
      const currentStudent = ctx.rootGetters["exam/student"];
      if (!currentStudent) {
        /**
         * 페이지 새로 고침 후 아직 학생이 로드되지 않음.
         */
        return;
      }
      return api.exam
        .wrongAnswer(currentStudent.seq, sectionSeq)
        .then((res) => {
          ctx.commit("updateRecord", { records: res.papers, clear: false });
        });
    },
  },
};
