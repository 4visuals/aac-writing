<template>
  <p :class="{ small: small }"><slot /></p>
</template>

<script>
export default {
  props: ["small"],
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
  }
}
@include tablet {
  p {
    font-size: 2rem;
    &.small {
      font-size: 1.5rem;
    }
  }
}
@include desktop {
  p {
    font-size: 2.5rem;
    &.small {
      font-size: 2rem;
    }
  }
}
</style>
