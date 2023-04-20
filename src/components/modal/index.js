import modalStore from "./modal-store";
import { markRaw } from "vue";
class ModalConfig {
  constructor(vueComponent, option) {
    this.comp = markRaw(vueComponent);
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
  get noBgc() {
    return this.option.noBgc || false;
  }
  get noShadow() {
    return this.option.noShadow || false;
  }
  get padding() {
    return this.option.padding || "0";
  }
}

const pushModal = (vueComponent, option) => {
  const config = new ModalConfig(vueComponent, option || {});
  modalStore.pushModal(config);
};
const showModal = (vueComponent, option) => {
  const config = new ModalConfig(vueComponent, option || {});
  modalStore.startModal(config);
};
const closeModal = () => modalStore.clear();

export default {
  ModalConfig,
  showModal,
  closeModal,
  pushModal,
};
