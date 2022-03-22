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
@import "~@/assets/resizer";
.form-elem {
  input {
    font-size: inherit;
  }
  @include mobile {
    input {
      padding: 1vmin;
      font-size: 3vmin;
    }
  }
  @include tablet {
    input {
      padding: 1vmin;
      font-size: 4vmin;
    }
  }
  @include desktop {
    input {
      padding: 1vmin;
      font-size: 4vmin;
    }
  }
}
</style>
