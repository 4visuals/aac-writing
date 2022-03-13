<template>
  <div class="flag" :style="{ width: width }">
    <img :src="flag" alt="" />
  </div>
</template>

<script>
export default {
  props: ["lang", "width"],
  setup(props) {
    const flag = require(`@/assets/flags/${props.lang.replace("_", "-")}.png`);
    return { flag };
  },
};
</script>
<style lang="scss" scoped>
.flag {
  width: 100%;
  height: auto;
  img {
    width: 100%;
    height: auto;
  }
}
</style>
