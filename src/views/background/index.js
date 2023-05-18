const valueOf = (val) => {
  return typeof val === "number" ? `${val}px` : val;
};
export class Shape {
  constructor(id, trs, pos, menuRef) {
    this.id = id;
    this.trs = trs;
    this.pos = pos;
    this.menuRef = menuRef;
  }
  toStyle() {
    const styles = Object.keys(this.pos).map(
      (dir) => `${dir}: ${valueOf(this.pos[dir])}`
    );
    const style = styles.join(";");
    return style;
  }
}

const shapes = {
  "/purchase": [
    new Shape("purchase01", { dir: "lr" }, { left: -190, top: 180 }, ""),
  ],
  "/purchase/contact": [
    new Shape("purchase00", { dir: "lr" }, { left: -190, top: 180 }, ""),
  ],
};

export const findShapes = (name) => {
  return shapes[name] || [];
};

export default {
  findShapes,
};
