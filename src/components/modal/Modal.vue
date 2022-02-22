<template>
  <div class="modals">
    <div class="back" @click="hide"></div>
    <div class="modal-wrapper md">
      <h3>모달창</h3>
      <slot></slot>
    </div>
  </div>
</template>

<script>
// import { ref } from "vue";
export default {
  emits: ["hidden"],
  setup(_, { emit }) {
    const hide = () => emit("hidden");
    return { hide };
  },
};
</script>

<style lang="scss" scoped>
.modals {
}
.back {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #0000004d;
  z-index: 1000;
}
.modal-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: calc(100% - 2rem);
  background-color: white;
  z-index: 1001;
  &.sm {
    width: 560px;
  }
  &.md {
    width: 980px;
  }
  &.lg {
    width: 1280px;
  }
}
</style>
