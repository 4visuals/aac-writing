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
        const height = Math.random() * 10 + 10;
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
    max-width: 60px;
    height: 80px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: flex-end;
    mask-image: linear-gradient(to top, transparent 0%, #aaa 10%);
    .bar {
      width: 10%;
      margin: 1px;
      background-color: #ffc107;
      transition: height 0.2s linear;
      border-radius: 2px;
      box-shadow: 0 0 1px 1px #0000004d;
    }
  }
}
</style>
