<template>
  <div class="header pink"><slot></slot></div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import "~@/assets/theme";
.header {
  padding: 12px 16px;
  &.pink {
    @include pink2($shadow: false);
  }
}
</style>
