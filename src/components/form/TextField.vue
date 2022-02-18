<template>
  <div class="form-elem" :style="style">
    <input type="text" />
  </div>
</template>

<script>
export default {
  props: ["value", "style"],
};
</script>

<style lang="scss" scoped>
.form-elem {
  input {
    font-size: inherit;
  }
}
</style>
