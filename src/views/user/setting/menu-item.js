export default class MenuItem {
  constructor(path, icon, label, active) {
    this.path = path;
    this.icon = icon;
    this.label = label;
    this.active = !!active;
  }
  setActive(active) {
    this.active = active;
  }
  getFullPath() {
    const subPath = this.path ? "/" + this.path : this.path;
    return `/setting${subPath}`;
  }
}
