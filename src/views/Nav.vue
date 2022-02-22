<template>
  <div class="red nav-bar">
    <ActionIcon icon="arrow_circle_left" @click="openMenu" />
    <h3>단계별 받아쓰기</h3>
    <div class="user">김똘똘</div>
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
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;
  box-shadow: 0 2px 3px #0000004d;
  &.red {
    background-color: #ff7b2d;
    color: white;
  }
  h3 {
    font-size: inherit;
    flex: 1 1 auto;
    display: block;
  }
  .user {
    font-size: 2rem;
  }
}
@include mobile {
  .nav-bar {
    font-size: 1.5rem;
    padding: 8px;
    column-gap: 8px;
    margin-bottom: 1rem;
  }
}
@include tablet {
  .nav-bar {
    font-size: 4rem;
    padding: 16px;
    column-gap: 16px;
  }
}
@include desktop {
  .nav-bar {
    font-size: 4rem;
    padding: 16px;
    column-gap: 16px;
  }
}
</style>
