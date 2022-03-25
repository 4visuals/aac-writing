class Menu {
  constructor(name) {
    this.name = name;
    this.visible = false;
  }
  get isVisible() {
    return this.visible;
  }
  show() {
    this.visible = true;
  }
  hide() {
    this.visible = false;
  }
}
class UI {
  constructor() {
    this.nav = { height: 120, expanded: true };
    this.topPadding = 120;
    this.bg = {
      visible: false,
    };
  }
  get backgroundVisible() {
    return this.bg.visible;
  }
  setBackgroundVisible(visible) {
    this.bg.visible = visible;
  }
}

const ui = new UI();
const leftMenu = new Menu("left");
export default {
  namespaced: true,
  state: () => ({ ui, leftMenu }),
  getters: {
    leftVisible(state) {
      return state.leftMenu.isVisible;
    },
    nav: (state) => state.ui.nav,
    backgroundVisible(state) {
      return state.ui.backgroundVisible;
    },
    topPadding: (state) => state.ui.topPadding,
  },
  mutations: {
    showMenu(state) {
      state.leftMenu.show();
    },
    hideMenu(state) {
      state.leftMenu.hide();
    },
    setBackgroundVisible(state, visible) {
      state.ui.setBackgroundVisible(visible);
    },
    setNavSize(state, { expanded, topPadding }) {
      state.ui.nav.expanded = expanded;
      state.ui.nav.height = expanded ? 120 : 56;
      if (topPadding) {
        state.ui.topPadding = topPadding;
      }
    },
  },
};
