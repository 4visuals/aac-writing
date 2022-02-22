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
  background-size: 200%;
  background-position: 10% 10%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: -1;
  opacity: 0.6;
  animation: bgslider 240s linear 1s infinite;
}

@keyframes bgslider {
  0% {
    background-position: 10% 10%;
  }
  25% {
    background-position: 90% 10%;
  }
  50% {
    background-position: 90% 90%;
  }
  75% {
    background-position: 10% 90%;
  }
  100% {
    background-position: 10% 10%;
  }
}
</style>
