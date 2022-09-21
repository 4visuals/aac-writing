import modalStore from "./modal-store";

class ModalConfig {
  constructor(vueComponent, option) {
    this.comp = vueComponent;
    this.option = option || {};
  }
  get props() {
    return this.option.props || {};
  }
  get events() {
    return this.option.events || {};
  }
  get width() {
    return this.option.width || "";
  }
  get fill() {
    return this.option.fill || false;
  }
  get rect() {
    return this.option.rect || false;
  }
}
const showModal = (vueComponent, option) => {
  const config = new ModalConfig(vueComponent, option || {});
  modalStore.startModal(config);
};
const closeModal = () => modalStore.clear();

export default {
  ModalConfig,
  showModal,
  closeModal,
};
