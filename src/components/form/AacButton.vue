<template>
  <div class="form-elem" :style="style">
    <button type="button">{{ text }}</button>
  </div>
</template>

<script>
export default {
  props: ["text", "style"],
  setup(props) {
    console.log(props);
  },
};
</script>

<style lang="scss" scoped>
.form-elem {
  button {
    font-size: inherit;
  }
}
</style>
