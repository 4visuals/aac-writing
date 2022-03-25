<template>
  <p :class="{ small: small, lg: lg }"><slot /></p>
</template>

<script>
export default {
  props: ["small", "lg"],
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
@include mobile {
  p {
    font-size: 1rem;
    &.small {
      font-size: 0.85rem;
    }
    &.lg {
      font-size: 1.25rem;
    }
  }
}
@include tablet {
  p {
    font-size: 2vmin;
    &.small {
      font-size: 1.8vmin;
    }
    &.lg {
      font-size: 2.5vmin;
    }
  }
}
@include desktop {
  p {
    font-size: 2vmin;
    &.small {
      font-size: 1.8vmin;
    }
    &.lg {
      font-size: 2.5vmin;
    }
  }
}
</style>
