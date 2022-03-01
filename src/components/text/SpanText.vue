<template>
  <span><slot /></span>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
@include mobile {
  span {
    font-size: 1rem;
  }
}
@include tablet {
  span {
    font-size: 2rem;
  }
}
@include desktop {
  span {
    font-size: 2.5rem;
  }
}
</style>
