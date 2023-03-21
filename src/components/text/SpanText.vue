<template>
  <span :class="[size || 'sm']"><slot /></span>
</template>

<script>
export default {
  props: ["size"],
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
@include mobile {
  span {
    font-size: 14px;
    &.sm {
      font-size: 12px;
    }
    &.lg {
      font-size: 16px;
    }
  }
}
@include tablet {
  span {
    font-size: 16px;
    &.sm {
      font-size: 14px;
    }
    &.lg {
      font-size: 18px;
    }
  }
}
@include desktop {
  span {
    font-size: 16px;
    &.sm {
      font-size: 14px;
    }
    &.lg {
      font-size: 18px;
    }
  }
}
</style>
