<template>
  <div class="bg" :style="styleObj"></div>
</template>

<script>
import { ref, watch } from "@vue/runtime-core";
export default {
  props: ["imgPath", "styles"],
  setup(props) {
    // const maxWidth = props.maxWidth || "400px";
    const styleObj = ref({
      "background-image": `url(${props.imgPath})`,
    });
    watch(
      () => props.imgPath,
      () => {
        styleObj.value["background-image"] = `url(${props.imgPath})`;
      }
    );
    return { styleObj };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
.bg {
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  flex: 1 1 auto;
  // max-width: var(--bg-max-width);
  @include mobile {
    & {
      max-width: 52%;
    }
  }
  @include tablet {
    & {
      max-width: 400px;
    }
  }
  @include desktop {
    & {
      max-width: 400px;
    }
  }
}
</style>
