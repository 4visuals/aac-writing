<template>
  <span :class="{ sm: size === 'sm', lg: size === 'lg' }"><slot /></span>
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
    font-size: 1.15rem;
    &.sm {
      font-size: 1rem;
    }
    &.lg {
      font-size: 1.35rem;
    }
  }
}
@include tablet {
  span {
    font-size: 1.35rem;
    &.sm {
      font-size: 1.2rem;
    }
    &.lg {
      font-size: 1.65rem;
    }
  }
}
@include desktop {
  span {
    font-size: 1.35rem;
    &.sm {
      font-size: 1.2rem;
    }
    &.lg {
      font-size: 1.65rem;
    }
  }
}
</style>
