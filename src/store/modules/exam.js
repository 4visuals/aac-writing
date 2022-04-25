/**
 * 퀴즈(시험) 정보 관리
 */
// import api from "@/service/api";
import storage from "@/service/storage";

class ExamSession {
  constructor(license) {
    this.license = license;
  }
}

export default {
  namespaced: true,
  state: () => ({ session: null, activeLicense: null }),
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
  },
};
