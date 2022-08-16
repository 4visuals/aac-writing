<template>
  <div class="header"><slot></slot></div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import "~@/assets/theme";
.header {
  padding: 12px 16px;
  display: flex;
  &.pink {
    @include pink2($shadow: false);
  }
}
</style>
