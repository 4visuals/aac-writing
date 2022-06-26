export default {
  namespaced: true,
  state: () => ({ refreshing: false }),
  mutations: {
    showRefreshView(state) {
      state.refreshing = true;
    },
  },
};
