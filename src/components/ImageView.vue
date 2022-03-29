<template>
  <div class="bg" :style="styleObj"></div>
</template>

<script>
export default {
  props: ["imgPath", "styles"],
  setup(props) {
    const maxWidth = props.maxWidth || "400px";
    const styleObj = {
      "--bg-max-width": maxWidth,
      "background-image": `url(${props.imgPath})`,
    };

    return { styleObj };
  },
};
</script>

<style lang="scss" scoped>
.bg {
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  flex: 1 1 auto;
  max-width: var(--bg-max-width);
}
</style>
