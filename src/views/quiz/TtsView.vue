<template>
  <div class="tts-wrapper">
    <div class="sound-wave" ref="wave">
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
    </div>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import { useStore } from "vuex";
import { onMounted } from "@vue/runtime-core";
export default {
  setup() {
    const store = useStore();
    const wave = ref(null);
    const heights = [];
    const repaint = (barEls, heights) => {
      barEls.forEach((el, index) => {
        let { height } = heights[index];
        height += 20 * Math.random() - 10;
        el.style.height = `${height}%`;
      });
      setTimeout(repaint, 200, barEls, heights);
    };
    onMounted(() => {
      const bars = wave.value.querySelectorAll(".bar");
      bars.forEach((_, index) => {
        const height = Math.random() * 30 + 20;
        heights.push({ index, height });
      });
      repaint(bars, heights);
    });
    return { store, wave };
  },
};
</script>

<style lang="scss" scoped>
.tts-wrapper {
  background-color: #ffffff4d;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  overflow: hidden;
  z-index: 100;
  .sound-wave {
    width: 80%;
    max-width: 300px;
    height: 300px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
    .bar {
      width: 10px;
      margin: 2px;
      background-color: #686868;
      transition: height 0.2s linear;
    }
  }
}
</style>
