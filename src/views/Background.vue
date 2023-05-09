<template>
  <div v-if="visible" class="bg" :style="`--bg-color: ${themeRef.bgc}`">
    <template v-for="s in shapes" :key="s.id">
      <img
        :src="`/img/bg/${s.id}.svg`"
        alt=""
        :style="s.toStyle()"
        :class="[s.trs.dir]"
      />
    </template>
  </div>
</template>

<script>
import { computed, reactive, watch } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import background from "./background/index";
export default {
  setup() {
    const route = useRoute();
    const store = useStore();
    const themeRef = computed(() => store.state.ui.theme);
    const shapes = reactive([]);
    console.log(route);

    watch(
      () => route.path,
      (path) => {
        shapes.splice(0, shapes.length);
        shapes.push(...background.findShapes(path));
      }
    );
    return {
      themeRef,
      shapes,
      visible: true,
    };
  },
};
</script>

<style lang="scss" scoped>
.bg {
  background-color: var(--bg-color);
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: -1;
  // animation: bgslider 160s linear 0s infinite;
  overflow: hidden;
  transition: background-color 0.2s;
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
