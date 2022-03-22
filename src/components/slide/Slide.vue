<template>
  <div
    class="slide"
    :style="`--slide-width:${dim.w.size + dim.w.unit};--slide-height:${
      dim.h.size + dim.h.unit
    }`"
  >
    <ActionIcon
      class="btn prev"
      @click="shiftBy(-1)"
      icon="keyboard_arrow_left"
    ></ActionIcon>
    <ActionIcon
      class="btn next"
      @click="shiftBy(1)"
      icon="keyboard_arrow_right"
    ></ActionIcon>
    <div class="viewport">
      <div
        class="viewport-body"
        :style="`transform: translateX(${dim.offset})`"
      >
        <div
          class="elem"
          v-for="(rss, idx) in resources"
          :key="idx"
          :style="{ 'background-image': `url(${resolveUrl(rss)})` }"
        ></div>
      </div>
      <div class="indicators">
        <div
          class="mark"
          :class="{ active: activeIdx === idx }"
          v-for="(_, idx) in resources"
          :key="idx"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { ActionIcon } from "@/components/form";
import { ref, watch } from "vue";
const normalize = (sz, unit) => {
  let v = "" + sz;
  if (v[0] === ".") {
    v = "0" + v;
  }
  const tokens = v.split(/(\d+\.\d+|\d+|\.\d+)/).filter((v) => v.length > 0);
  return {
    size: parseInt(tokens[0]),
    unit: tokens.length > 1 ? tokens[1] : unit,
  };
};
export default {
  components: {
    ActionIcon,
  },
  props: ["resources", "width", "height", "resolveUrl"],
  setup(props) {
    const activeIdx = ref(0);
    const dim = ref({
      w: normalize(props.width, "px"),
      h: normalize(props.height, "px"),
      offset: 0,
    });
    watch(
      () => activeIdx.value,
      () => {
        dim.value.offset = `${-1 * dim.value.w.size * activeIdx.value}${
          dim.value.w.unit
        }`;
      }
    );
    const shiftBy = (delta) => {
      const size = props.resources.length;
      let idx = activeIdx.value + delta;
      idx = Math.min(size - 1, idx);
      idx = Math.max(0, idx);
      activeIdx.value = idx;
    };
    return { dim, activeIdx, shiftBy };
  },
};
</script>

<style lang="scss" scoped>
.slide {
  display: flex;
  align-items: center;
  justify-content: center;
  button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 3rem;
    color: white;
    text-shadow: 1px 1px 3px black;
    z-index: 10;
    &.prev {
      left: 2rem;
    }
    &.next {
      right: 2rem;
    }
  }
  .viewport {
    width: var(--slide-width);
    height: var(--slide-height);
    overflow: hidden;
    display: flex;
    position: relative;
    .viewport-body {
      display: flex;
      transform: translateX(0);
      transition: transform 0.2s ease-in;

      .elem {
        flex: 0 0 var(--slide-width);
        width: var(--slide-width);
        height: var(--slide-height);
        background-color: beige;
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
      }
    }
    .indicators {
      position: absolute;
      bottom: 16px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: flex-end;
      column-gap: 0.6vmin;
      .mark {
        width: 4vmin;
        height: 0.3vmin;
        background-color: #ffffff8d;
        transition: height 0.2s ease-in;
        &.active {
          background-color: #fff;
          height: 1vmin;
        }
      }
    }
  }
}
</style>
