<template>
  <div class="wave-bg" :style="`background-color: ${bgc}`"></div>
</template>

<script>
export default {
  props: ["bgc"],
};
</script>

<style lang="scss" scoped>
.wave-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-position: center;
  background-size: cover;
  z-index: -10;
  mask-image: url("~@/assets/wave-blue.svg");
  mask-repeat: no-repeat;
  mask-size: cover;
  mask-position: center bottom;
}
svg {
  position: absolute;
  width: 100%;
  height: auto;
  z-index: -1;
}
</style>
