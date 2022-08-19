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
import { computed, onMounted } from "vue";
import { ref } from "vue";
import { useStore } from "vuex";
export default {
  setup() {
    const bgRef = ref(null);
    const pathes = "00,01,02,03".split(",").map((fnum, index) => {
      const url = require(`@/assets/chars/char${fnum}.svg`);
      return { index, url, x: 0, y: 0 };
    });
    const pathesRef = ref(pathes);

    const store = useStore();
    const visible = computed(() => store.getters["ui/backgroundVisible"]);
    const rand = (min, max) => {
      return Math.random() * (max - min) + min;
    };
    const assignPosition = () => {
      const width = document.body.offsetWidth;
      const height = document.body.offsetHeight;
      const imgRadius = 80 / 2; // half of image size
      pathesRef.value.forEach((path) => {
        path.x = rand(imgRadius, width - imgRadius);
        path.y = rand(imgRadius, height - imgRadius);
      });
    };
    onMounted(() => {
      assignPosition();
      // console.log(width, height);
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
  animation: bgslider 160s linear 0s infinite;
  overflow: hidden;
  .char {
    width: 80px;
    height: 80px;
    position: absolute;
    background-size: contain;
    background-repeat: no-repeat;
    opacity: 0.8;
    // animation: bingle 160s linear 0s infinite;
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
