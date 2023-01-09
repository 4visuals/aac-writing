<template>
  <div class="modals">
    <div class="back" @click="fadeOut" v-if="visible"></div>
    <transition name="fade" @after-leave="hidden">
      <div
        class="modal-wrapper"
        :class="{
          container: !fill,
          sm: width === 'sm',
          md: width === 'md',
          fill: fill,
          rect: rect,
          'no-bgc': noBgc === true,
          'no-shadow': noShadow === true,
        }"
        :style="{
          height: fill ? '100%' : height ? height : 'auto',
          'overflow-y': height ? 'auto' : 'auto',
        }"
        v-if="visible"
      >
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
export default {
  emits: ["hidden"],
  props: ["width", "height", "fill", "rect", "noBgc", "noShadow"],
  setup(props, { emit }) {
    const fadeOut = () => {
      visible.value = false;
    };
    const hidden = () => emit("hidden");
    const visible = ref(false);
    onMounted(() => {
      visible.value = true;
    });
    return { fadeOut, hidden, visible };
  },
};
</script>

<style lang="scss" scoped>
.modals {
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
  .fade-enter-active {
    transition: all 0.2s cubic-bezier(0.01, 0.6, 0.58, 1) 0.2s;
  }
  .fade-leave-active {
    transition: all 0.2s cubic-bezier(0.01, 0.6, 0.58, 1);
  }
}
.back {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #00000000;
  z-index: 1000;
}
.modal-wrapper {
  $gap: 6px;
  position: absolute;
  top: 50%;
  left: calc(50% - $gap);
  transform: translate(-50%, -50%);
  // max-width: calc(100% - 2rem);
  background-color: white;

  // height: 500px;
  // background-color: #ffeb3c;
  // box-shadow: $gap $gap 0px #f3d231;
  width: calc(100% - 4rem);
  padding: 0;
  box-shadow: rgba(0, 0, 0, 0.56) 0px 22px 70px 4px;
  z-index: 1000;
  border-radius: 2vmin;
  // overflow: hidden;
  &.sm {
    max-width: 560px;
  }
  &.md {
    max-width: 720px;
  }
  &.fill {
    left: 50%;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  &.rect {
    border-radius: 0;
  }
  &.no-shadow {
    box-shadow: none;
  }
  &.no-bgc {
    background-color: transparent;
  }
}
</style>
