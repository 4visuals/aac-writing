export default class MenuItem {
  constructor(path, icon, label, actions = []) {
    this.path = path;
    this.icon = icon;
    this.label = label;
    this.active = false;
    this.actions = actions;
  }
  setActive(active) {
    this.active = active;
  }
  getFullPath() {
    const subPath = this.path ? "/" + this.path : this.path;
    return `/setting${subPath}`;
  }
}
