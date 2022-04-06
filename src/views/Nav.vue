<template>
  <div class="red nav-bar">
    <ActionIcon class="btn-menu left" icon="menu" @click="openMenu" />
    <Logo
      class="btn-menu right"
      :imagePath="membership && membership.image"
      :vendor="membership ? membership.vendor : 'guest'"
      size="sm"
    />
  </div>
</template>

<script>
import Logo from "@/components/oauth/Logo.vue";
import { useStore } from "vuex";
import { ActionIcon } from "@/components/form";
import { computed } from "@vue/runtime-core";
// import router from "@/router";

export default {
  components: {
    ActionIcon,
    Logo,
  },
  setup() {
    const store = useStore();
    const membership = computed(() => store.state.user.membership);
    const openMenu = () => {
      // console.log("[back]", router);
      // router.back();
      store.commit("ui/showMenu");
    };
    return {
      openMenu,
      membership,
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
    z-index: 75;
    &.left {
      left: 16px;
    }
    &.right {
      right: 16px;
    }
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
