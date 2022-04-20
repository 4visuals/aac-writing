/**
 * 퀴즈(시험) 정보 관리
 */
import api from "@/service/api";
console.log(api);

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
    },
  },
};
