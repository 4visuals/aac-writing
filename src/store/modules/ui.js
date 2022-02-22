class UI {
  constructor() {
    this.navHeight = 0;
  }
}

const ui = new UI();

export default {
  state: () => ({ ui }),
};
