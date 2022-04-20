<template>
  <div class="logo" :class="size || 'sm'">
    <div class="guest" v-if="vendor === 'guest'"></div>
    <img referrerpolicy="no-referrer" :src="imagePath" v-else />
  </div>
</template>

<script>
export default {
  props: ["imagePath", "size"],
  setup() {},
};
</script>

<style lang="scss" scoped>
.logo {
  display: flex;
  position: relative;
  flex-direction: column;

  &.xs {
    width: 24px;
    height: 24px;
    img {
      border-radius: 12px;
    }
  }
  &.sm {
    width: 38px;
    height: 38px;
    img {
      border-radius: 19px;
    }
  }

  &.md {
    width: 64px;
    height: 64px;
    img {
      border-radius: 32px;
    }
  }
  .guest {
    flex: 1 1 auto;
    mask-image: url("~@/assets/logo/logo_guest.svg");
    mask-repeat: no-repeat;
    mask-size: contain;
    background-color: #888888;
  }
  img {
    flex: 1 1 auto;
    width: 100%;
    height: auto;
  }
}
</style>
