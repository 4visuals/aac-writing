import storage from "@/service/storage";
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
  sen_passed: "sen_passed",
  sen_failed: "sen_failed",
  word_passed: "word_passed",
  word_failed: "word_failed",
};
class UI {
  constructor() {
    this.nav = { height: 120, expanded: true };
    this.topPadding = 120;
    this.bg = {
      visible: true,
    };
    this.reward = {
      name: false,
      onClose: null,
    };
    this.activeChapters = {
      level: null,
      book: null,
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
      onClose(name.endsWith("passed"));
      this.reward.onClose = null;
    }
    this.reward.name = null;
    this.reward.onClose = null;
  }
  markChapter(name, seq) {
    this.activeChapters[name] = seq;
    storage.session.write("aac_dictation_ui:chapter", this.activeChapters);
  }
  getActiveChapter(group) {
    return this.activeChapters[group];
  }
  init() {
    this.activeChapters = storage.session.read("aac_dictation_ui:chapter", {
      level: null,
      book: null,
    });
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

ui.init();

export default {
  namespaced: true,
  state: () => ({ ui, leftMenu, themes }),
  getters: {
    appHeight: (state) => state.ui.appHeight,
    leftVisible(state) {
      return state.leftMenu.isVisible;
    },
    nav: (state) => state.ui.nav,
    backgroundVisible(state) {
      return state.ui.backgroundVisible;
    },
    topPadding: (state) => state.ui.topPadding,
    reward: (state) => state.ui.reward.name,
    activeChapter: (state) => (group) => state.ui.getActiveChapter(group),
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
    setAppHeight(state, h) {
      state.ui.setAppHeight(h);
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
    setActiveChapter(state, { group, seq }) {
      state.ui.markChapter(group, seq);
    },
  },
};
