export default {
  namespaced: true,
  state: {
    menus: [],
    active: null,
  },
  mutations: {
    setMenus(state, menus) {
      state.menus = menus;
    },
    setActive(state, menu) {
      const old = state.active;
      if (old) {
        old.setActive(false);
      }
      if (menu) {
        menu.setActive(true);
      }
      state.active = menu;
    },
  },
};
