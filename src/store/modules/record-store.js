import api from "@/service/api";
import Record from "../../entity/record";
import util from "../../service/util";
import SectionRecord from "../../entity/section-record";
/**
 *
 * @param {Record[]} records
 */
const groupBySection = (records) => {
  return util.arr.groupByMap(
    records,
    (record) => record.sectionRef,
    (sectionSeq) => {
      return new SectionRecord(sectionSeq);
    },
    (sectionRecord, record) => sectionRecord.add(record)
  );
};
export default {
  namespaced: true,
  state: () => ({
    records: new Map(),
    mod: 0,
    values: [],
    perfectMap: new Map(),
  }),
  getters: {
    wrongAnswers: (state) => (section) => {
      if (!section) {
        return [];
      }
      const { seq } = section;
      return state.values.filter(
        (record) => record.sectionRef === seq && record.numOfWrongAnswer > 0
      );
    },
    records: (state) => state.values,
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
      // cache를 떠놓자!
      if (clear || records.length > 0) {
        state.values = [...state.records.values()];
        state.perfectMap = groupBySection(state.values);
        state.mod++;
      }
    },
  },
  actions: {
    prefetch: (ctx, studentRef) => {
      const sections = ctx.rootGetters["course/sections"];
      return api.exam.getRecords(studentRef).then((res) => {
        ctx.commit("updateRecord", {
          sections,
          records: res.papers,
          clear: true,
        });
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
          ctx.commit("updateRecord", {
            records: res.papers,
            clear: false,
          });
        });
    },
  },
};
