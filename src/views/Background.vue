<template>
  <div v-if="visible" class="bg" ref="bgRef">
    <div
      class="char"
      v-for="path in pathesRef"
      :key="path.index"
      :style="{
        'background-image': `url(${path.url})`,
        top: `${path.y}px`,
        left: `${path.x}px`,
      }"
    ></div>
  </div>
</template>

<script>
import { trigger } from "@vue/reactivity";
import { computed, onMounted, onUnmounted } from "vue";
import { ref } from "vue";
import { useStore } from "vuex";
export default {
  setup() {
    const IMG_SIZE = 48;
    const bgRef = ref(null);
    const pathes = "00,01,02,03".split(",").map((fnum, index) => {
      const url = require(`@/assets/chars/char${fnum}.svg`);
      return { index, url, x: 0, y: 0, vx: 0, vy: 0, width: 48, height: 48 };
    });
    const pathesRef = ref([]);

    const store = useStore();
    const visible = computed(() => store.getters["ui/backgroundVisible"]);
    const rand = (min, max) => {
      return Math.random() * (max - min) + min;
    };
    let t = null;
    // eslint-disable-next-line no-unused-vars
    const updatePosition = () => {
      const { offsetWidth: W, offsetHeight: H } = bgRef.value;
      pathesRef.value.forEach((path) => {
        path.x += path.vx;
        path.y += path.vy;
        if (path.x + path.width < 0 || path.x >= W) {
          path.vx *= -1;
        }
        if (path.y + path.height <= 0 || path.y >= H) {
          path.vy *= -1;
        }
      });
      trigger(pathesRef);
      t = setTimeout(updatePosition, 2000);
    };

    const assignPosition = () => {
      const width = document.body.offsetWidth;
      const height = document.body.offsetHeight;
      const imgRadius = IMG_SIZE / 2; // half of image size
      pathes.forEach((path) => {
        path.x = rand(imgRadius, width - imgRadius);
        path.y = rand(imgRadius, height - imgRadius);
        const deg = rand(0, Math.PI);
        path.vx = 30 * Math.sin(deg);
        path.vy = 30 * Math.cos(deg);
      });
      pathesRef.value = pathes;
      updatePosition();
    };
    onMounted(() => {
      assignPosition();
      // console.log(width, height);
    });
    onUnmounted(() => {
      clearTimeout(t);
    });
    return {
      bgRef,
      visible,
      path: require("@/assets/bg00.jpg"),
      pathesRef,
    };
  },
};
</script>

<style lang="scss" scoped>
.bg {
  background-color: #fffbec;
  background-size: 150%;
  background-position: 10% 10%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: -1;
  opacity: 0.6;
  // animation: bgslider 160s linear 0s infinite;
  overflow: hidden;
  .char {
    width: 48px;
    height: 48px;
    position: absolute;
    background-size: contain;
    background-repeat: no-repeat;
    opacity: 0.8;
    transition: all 2s linear;
    // animation: bingle 8s linear 0s infinite;
  }
}

@keyframes bingle {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes bgslider {
  0% {
    background-position: 10% 10%;
  }
  23% {
    background-position: 90% 10%;
  }
  25% {
    background-position: 90% 10%;
  }
  48% {
    background-position: 90% 90%;
  }
  50% {
    background-position: 90% 90%;
  }
  73% {
    background-position: 10% 90%;
  }
  75% {
    background-position: 10% 90%;
  }
  98% {
    background-position: 10% 10%;
  }
}
</style>
