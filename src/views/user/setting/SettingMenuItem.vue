<template>
  <div class="menu" :class="{ active: menu.path === active.path }">
    <AppIcon :icon="menu.icon" fsize="20px" /><span class="label">{{
      menu.label
    }}</span>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  props: ["menu"],
  setup() {
    const store = useStore();
    const active = computed(() => store.state.setting.active);
    return { active };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
.menu {
  font-size: 20px;
  display: flex;
  align-items: center;
  column-gap: 16px;
  padding: 12px 16px;
  user-select: none;
  cursor: pointer;
  &:hover {
    background-color: #a4dcff;
  }
  &.active {
    background-color: #a4dcff;
  }
}
@include mobile {
  .menu {
    padding: 12px;
    .label {
      display: none;
    }
  }
}
@include tablet {
}
@include desktop {
}
</style>
