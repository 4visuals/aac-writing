<template>
  <div class="red nav-bar">
    <ActionIcon class="btn-menu" icon="menu" @click="openMenu" />
  </div>
</template>

<script>
import { useStore } from "vuex";
import { ActionIcon } from "@/components/form";
// import router from "@/router";

export default {
  components: {
    ActionIcon,
  },
  setup() {
    const store = useStore();
    const openMenu = () => {
      // console.log("[back]", router);
      // router.back();
      store.commit("ui/showMenu");
    };
    return {
      openMenu,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";

.nav-bar {
  display: flex;
  align-items: center;
  width: 100%;
  z-index: 100;
  // box-shadow: 0 2px 3px #0000004d;
  .btn-menu {
    position: fixed;
    top: 16px;
    left: 16px;
    z-index: 75;
  }
}
@include mobile {
  .nav-bar {
    font-size: 1.5rem;
    column-gap: 8px;
  }
}
@include tablet {
  .nav-bar {
    font-size: 2rem;
    column-gap: 16px;
  }
}
@include desktop {
  .nav-bar {
    font-size: 2rem;
    column-gap: 16px;
  }
}
</style>
