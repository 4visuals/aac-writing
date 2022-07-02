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
const rewards = {
  passed: "passed",
  failed: "failed",
};
class UI {
  constructor() {
    this.nav = { height: 120, expanded: true };
    this.topPadding = 120;
    this.bg = {
      visible: false,
    };
    this.reward = {
      name: false,
      onClose: null,
    };
  }
  get backgroundVisible() {
    return this.bg.visible;
  }
  setBackgroundVisible(visible) {
    this.bg.visible = visible;
  }
  showReward(rewardSpec) {
    const reward = rewards[rewardSpec.name];
    this.reward.name = reward;
    this.reward.onClose = rewardSpec.onClose;
  }
  setAppHeight(height) {
    this.appHeight = height;
  }
  hideReward() {
    const { name, onClose } = this.reward;
    if (onClose) {
      onClose(name === "passed");
      this.reward.onClose = null;
    }
    this.reward.name = null;
    this.reward.onClose = null;
  }
}

const themes = {
  gold: {
    bgc: "gold",
    button: {
      color: "#865900",
      bgc: "#ffec88",
    },
  },
  pink: {
    bgc: "#ff9bbd",
    button: {
      color: "#d23d70",
      bgc: "#ffe1ea",
    },
  },
};
const ui = new UI();
const leftMenu = new Menu("left");

export default {
  namespaced: true,
  state: () => ({ ui, leftMenu, themes }),
  getters: {
    leftVisible(state) {
      return state.leftMenu.isVisible;
    },
    nav: (state) => state.ui.nav,
    backgroundVisible(state) {
      return state.ui.backgroundVisible;
    },
    topPadding: (state) => state.ui.topPadding,
    reward: (state) => state.ui.reward.name,
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
    setAppHeight(state) {
      state.ui.setAppHeight(visualViewport.height);
    },
    setNavSize(state, { expanded, topPadding }) {
      state.ui.nav.expanded = expanded;
      state.ui.nav.height = expanded ? 120 : 56;
      if (Number.isInteger(topPadding)) {
        state.ui.topPadding = topPadding;
      }
    },
    showReward(state, spec) {
      state.ui.showReward(spec);
    },
    hideReward(state) {
      state.ui.hideReward();
    },
  },
};
