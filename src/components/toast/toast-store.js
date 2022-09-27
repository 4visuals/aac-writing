import store from "@/store";

store.registerModule("toast", {
  namespaced: true,
  state: () => ({
    toasts: [],
  }),
  getters: {
    toasts: (state) => state.toasts,
  },
  mutations: {
    addToast: (state, toast) => {
      state.toasts.push(toast);
    },
    close: (state, toast) => {
      const idx = state.toasts.findIndex((elem) => elem.id === toast.id);
      if (idx >= 0) {
        const toasts = state.toasts.splice(idx, 1);
        toasts[0].beforeDelete();
      }
    },
  },
});

const addToast = (toast) => store.commit("toast/addToast", toast);
const closeToast = (toast) => store.commit("toast/close", toast);
export default {
  addToast,
  closeToast,
};
