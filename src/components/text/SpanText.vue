<template>
  <span :class="{ small: small }"><slot /></span>
</template>

<script>
export default {
  props: ["small"],
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
@include mobile {
  span {
    font-size: 1rem;
    &.small {
      font-size: 0.85rem;
    }
  }
}
@include tablet {
  span {
    font-size: 1.8rem;
    &.small {
      font-size: 1.5rem;
    }
  }
}
@include desktop {
  span {
    font-size: 1.8rem;
    &.small {
      font-size: 1.5rem;
    }
  }
}
</style>
