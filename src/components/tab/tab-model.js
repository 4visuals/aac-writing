import { shallowRef } from "vue";

class TabItem {
  constructor(text, cmd, clazz) {
    this.text = text;
    this.cmd = cmd;
    this.clazz = clazz;
    this.active = false;
  }
}
class TabModel {
  /**
   * @constructs
   * @param {TabItem[]} items
   */
  constructor(items) {
    this.items = items;
    this.activeIndex = this.items.findIndex((item) => item.active);
    /** @type { import("vue").ShallowRef<{text:string, cmd:string}> } */
    this.activeTab = shallowRef(this.items[this.activeIndex]);
  }
  get activeCommand() {
    const { activeIndex } = this;
    return this.items[activeIndex].cmd;
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
  setActiveAt(index) {
    const tab = this.items[index];
    if (tab) {
      this.setActiveTab(tab);
    }
  }
  findTab(fnPredicate) {
    return this.items.find(fnPredicate);
  }
  hasBody() {
    return !!this.items[0]._body;
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
 * tab model 생성
 * @param {[{text:string, cmd:string}]} items
 * @returns { TabModel[] }
 */
TabModel.create = (items) => {
  let activeIndex = -1;
  const commands = new Set();
  const tabItems = items.map((item, index) => {
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
    if (!body) {
      item._body = null;
    } else if (body.comp) {
      item._body = new BodyComp(body.comp, body.args || {}, body.events || {});
    } else {
      item._body = new BodyComp(body, {}, {});
    }
    item.active = false;
    return new TabItem(item.text, cmd);
  });

  if (activeIndex < 0) {
    activeIndex = 0;
  }
  tabItems[activeIndex].active = true;
  const model = new TabModel(tabItems);
  return model;
};
export default TabModel;
