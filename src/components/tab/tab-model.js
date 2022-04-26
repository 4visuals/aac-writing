import { shallowRef } from "vue";

class TabModel {
  constructor(items) {
    this.items = items;
    this.activeIndex = this.items.findIndex((item) => item.active);
    this.activeTab = shallowRef(this.items[this.activeIndex]);
  }
  get length() {
    return this.items.length;
  }
  tabAt(index) {
    return this.items[index];
  }
  setActiveTab(tab) {
    this.activeTab.value.active = false;
    this.activeIndex = this.items.findIndex((item) => item.cmd === tab.cmd);
    tab.active = true;
    this.activeTab.value = tab;
  }
}
class BodyComp {
  constructor(comp, args, events) {
    this.comp = comp;
    this.args = args;
    this.events = events;
  }
}
/**
 *
 * @param {[{text:string, cmd:string}]} items
 * @returns
 */
TabModel.create = (items) => {
  let activeIndex = -1;
  const commands = new Set();
  items.forEach((item, index) => {
    let cmd = item.cmd;
    if (!cmd) {
      throw new Error(`property cmd is required, but [${item.cmd}]`);
    }
    cmd = cmd.trim();
    if (commands.has(cmd)) {
      throw new Error(`duplicated cmd [${item.cmd}]`);
    }
    commands.add(cmd);
    if (item.active === true) {
      activeIndex = index;
    }
    const { body } = item;
    if (body.comp) {
      item._body = new BodyComp(body.comp, body.args || {}, body.events || {});
    } else {
      item._body = new BodyComp(body, {}, {});
    }
    item.active = false;
  });

  if (activeIndex < 0) {
    activeIndex = 0;
  }
  items[activeIndex].active = true;
  const model = new TabModel(items);
  return model;
};
export default TabModel;
