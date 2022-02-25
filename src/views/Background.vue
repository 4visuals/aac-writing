<template>
  <div class="bg" :style="{ 'background-image': `url(${path})` }"></div>
</template>

<script>
export default {
  setup() {
    console.log(require("@/assets/bg00.jpg"));
    return {
      path: require("@/assets/bg00.jpg"),
    };
  },
};
</script>

<style lang="scss" scoped>
.bg {
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
