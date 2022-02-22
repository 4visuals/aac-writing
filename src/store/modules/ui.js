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
    this.navHeight = 0;
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
  },
  mutations: {
    showMenu(state) {
      state.leftMenu.show();
    },
    hideMenu(state) {
      state.leftMenu.hide();
    },
  },
};
