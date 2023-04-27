<template>
  <div class="bg">
    <template v-for="s in activeShapes" :key="s.id">
      <img
        :src="`/img/bg/shape${s.id}.svg`"
        alt=""
        :style="s.toStyle()"
        :class="[s.trs.dir, s.menuRef === activeMenu.path ? 'on' : 'off']"
      />
    </template>
  </div>
</template>

<script>
import { reactive, watch } from "vue";

const valueOf = (val) => {
  return typeof val === "number" ? `${val}px` : val;
};
class Shape {
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
export default {
  props: {
    activeMenu: {
      type: Object,
      requre: true,
    },
  },
  setup(props) {
    const shapes = [
      new Shape("00", { dir: "lr" }, { left: 32, top: 96 }, "account"),
      new Shape("01", { dir: "lr" }, { left: -480, top: 60 }, "account"),
      new Shape("02", { dir: "rl" }, { right: -32, top: 76 }, "account"),
      new Shape("03", { dir: "rl" }, { right: -193, top: 163 }, "account"),

      new Shape("13", { dir: "rl" }, { right: -50, bottom: -120 }, "student"),
      new Shape("12", { dir: "lr" }, { left: -30, bottom: 0 }, "student"),
      new Shape("11", { dir: "lr" }, { left: 0, top: 175 }, "student"),
      new Shape("10", { dir: "lr" }, { left: -42, top: 87 }, "student"),

      new Shape("20", { dir: "lr" }, { left: -300, bottom: -300 }, "license"),
      new Shape("21", { dir: "lr" }, { left: -600, bottom: -220 }, "license"),

      new Shape("33", { dir: "rl" }, { right: -53, bottom: -23 }, "order"),
      new Shape("32", { dir: "rl" }, { right: -110, top: 128 }, "order"),
      new Shape("31", { dir: "rl" }, { right: 0, top: 128 }, "order"),
      new Shape("30", { dir: "lr" }, { left: -280, top: 80 }, "order"),
    ];

    const activeShapes = reactive(shapes);

    watch(
      () => props.activeMenu,
      () => {
        // activeShapes.splice(0, activeShapes.length);
        // activeShapes.push(
        //   ...shapes.filter((shape) => shape.menuRef === menu.path)
        // );
      },
      { immediate: true }
    );
    return { activeShapes };
  },
};
</script>

<style lang="scss" scoped>
.bg {
  overflow: hidden;
  z-index: -1;
  position: fixed;
  inset: 0;

  img {
    position: absolute;
    user-select: none;
    pointer-events: none;
    transition: opacity 0.25s cubic-bezier(0.01, 0.6, 0.58, 1);
    &.on {
      opacity: 1;
    }
    &.off {
      opacity: 0;
      // &.lr {
      //   transform: translateX(-100%);
      // }
      // &.rl {
      //   transform: translateX(100%);
      // }
    }
  }
}
</style>
