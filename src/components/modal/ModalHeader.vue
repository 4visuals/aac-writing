<template>
  <div class="header" :class="{ shadow: shadow }"><slot></slot></div>
</template>

<script>
export default {
  props: {
    shadow: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/theme";
.header {
  padding: 12px 16px;
  display: flex;
  font-size: 2rem;
  &.pink {
    @include pink2($shadow: false);
  }
  &.shadow {
    box-shadow: 0px 1px 4px 0px #0000002c;
  }
}
</style>
