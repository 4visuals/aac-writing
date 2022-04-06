<template>
  <div class="logo" :class="size || 'sm'">
    <div class="guest" v-if="vendor === 'guest'"></div>
    <img :src="imagePath" v-else />
    <div
      v-if="vendor !== 'guest'"
      class="vendor"
      :style="`--bg-img: url(${vendorImage})`"
    ></div>
  </div>
</template>

<script>
import { ref, watch } from "@vue/runtime-core";
export default {
  props: ["imagePath", "vendor", "size"],
  setup(props) {
    console.log("[VENDOR]", props.vendor);
    const vendorImage = ref(require(`@/assets/logo/logo_${props.vendor}.svg`));
    watch(
      () => props.vendor,
      () => {
        vendorImage.value = require(`@/assets/logo/logo_${props.vendor}.svg`);
      }
    );
    return {
      vendorImage,
    };
  },
};
</script>

<style lang="scss" scoped>
.logo {
  display: flex;
  position: relative;
  flex-direction: column;
  &.sm {
    width: 38px;
    height: 38px;
    img {
      border-radius: 19px;
    }
    .vendor {
      width: 16px;
      height: 16px;
      border-radius: 16px;
    }
  }
  &.md {
    width: 64px;
    height: 64px;
    img {
      border-radius: 32px;
    }
    .vendor {
      width: 24px;
      height: 24px;
      border-radius: 24px;
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
  }
  .vendor {
    position: absolute;
    background-image: var(--bg-img);
    background-repeat: no-repeat;
    background-size: contain;
    bottom: 0;
    right: 0;
    background-color: white;
    border: 2px solid white;
  }
}
</style>
