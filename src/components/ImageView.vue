<template>
  <div class="bg" :style="styleObj" @click.stop.prevent="clicked"></div>
</template>

<script>
import { ref, watch } from "@vue/runtime-core";
export default {
  props: ["imgPath", "styles"],
  setup(props, { emit }) {
    // const maxWidth = props.maxWidth || "400px";
    const styleObj = ref({
      "background-image": `url(${props.imgPath})`,
    });
    const clicked = (e) => {
      e.stopPropagation();
      e.preventDefault();
      console.log("[!!]", e);
      emit("clicked", e);
    };
    watch(
      () => props.imgPath,
      () => {
        styleObj.value["background-image"] = `url(${props.imgPath})`;
      }
    );
    return { styleObj, clicked };
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
