<template>
  <div class="red nav-bar">
    <ActionIcon class="btn-menu left" icon="menu" @click="openMenu" />
    <Logo
      class="btn-menu right"
      :imagePath="membership && membership.image"
      :vendor="membership ? membership.vendor : 'guest'"
      size="xs"
      @click="showLicenseBox"
    />
    <div class="lcs-combobox" v-if="boxVisible" @click="hideLincenseBox">
      <div class="lcs">감자군</div>
      <div class="lcs">양파군</div>
    </div>
  </div>
</template>

<script>
import Logo from "@/components/oauth/Logo.vue";
import { useStore } from "vuex";
import { ActionIcon } from "@/components/form";
import { computed, ref } from "@vue/runtime-core";
// import router from "@/router";

export default {
  components: {
    ActionIcon,
    Logo,
  },
  setup() {
    const store = useStore();
    const membership = computed(() => store.state.user.membership);
    const boxVisible = ref(false);
    const openMenu = () => {
      // console.log("[back]", router);
      // router.back();
      store.commit("ui/showMenu");
    };
    const showLicenseBox = () => {
      boxVisible.value = true;
    };
    const hideLincenseBox = () => {
      boxVisible.value = false;
    };
    return {
      boxVisible,
      openMenu,
      membership,
      showLicenseBox,
      hideLincenseBox,
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
  .lcs-combobox {
    position: fixed;
    top: 10px;
    z-index: 75;
    right: 56px;
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
