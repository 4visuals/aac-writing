<template>
  <div class="stud-logo-wrapper">
    <div class="chr logo" :class="size || ''" @click="openMenu">
      {{ char() }}
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
export default {
  props: ["student", "size"],
  setup(props) {
    const store = useStore();
    const char = () => {
      return (
        props.student &&
        props.student.name.split("").reverse().slice(0, 2).reverse().join("")
      );
    };
    const openMenu = () => {
      store.commit("ui/showMenu");
    };
    return { char, openMenu };
  },
};
</script>

<style lang="scss" scoped>
.stud-logo-wrapper {
  display: flex;
  .logo {
    width: 32px;
    height: 32px;
    line-height: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: brown;
    color: white;
    border-radius: 28px;
    padding: 6px;
    font-size: 12px;
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
    &.sm {
      width: 24px;
      height: 24px;
      font-size: 10px;
    }
    &.lg {
      width: 40px;
      height: 40px;
      font-size: 14px;
    }
  }
}
</style>
