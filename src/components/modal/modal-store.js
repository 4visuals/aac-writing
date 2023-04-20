import store from "@/store";

store.registerModule("modal", {
  namespaced: true,
  state: () => ({
    modalStack: [],
  }),
  getters: {
    currentModal: (state) => {
      const { modalStack } = state;
      return modalStack.length === 0 ? null : modalStack[modalStack.length - 1];
    },
  },
  mutations: {
    pushModal: (state, modalConfig) => {
      state.modalStack.push(modalConfig);
    },
    popModal: (state) => {
      const lastIdx = state.modalStack.length - 1;
      state.modalStack.splice(lastIdx, 1);
    },
    clear: (state) => {
      state.modalStack.splice(0, state.modalStack.length);
    },
  },
});

export default {
  startModal: (modalConfig) => store.commit("modal/pushModal", modalConfig),
  pushModal: (modalConfig) => store.commit("modal/pushModal", modalConfig),
  clear: () => store.commit("modal/clear"),
};
