<template>
  <Background />
  <div
    class="app-wrapper"
    ref="wrapperEl"
    :style="`padding-top: ${topPadding}px`"
  >
    <Nav v-if="route.path !== '/'" ref="nav" />

    <router-view v-slot="{ Component }">
      <transition
        :name="tr.name"
        mode="out-in"
        :duration="{ enter: 300, leave: 0 }"
      >
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
  <MenuWrapper v-if="menuVisible" />
</template>
<script>
import env from "@/service/env";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { computed, onMounted, onUnmounted, shallowRef } from "vue";
import Nav from "@/views/Nav.vue";
import Background from "./views/Background.vue";
import MenuWrapper from "./views/menu/MenuWrapper.vue";
export default {
  components: {
    Nav,
    Background,
    MenuWrapper,
  },
  setup() {
    console.log(env);
    const store = useStore();
    const menuVisible = computed(() => store.getters["ui/leftVisible"]);
    const topPadding = computed(() => store.getters["ui/topPadding"]);

    const route = useRoute();
    // console.log(route.path, route.params, topPadding);
    const tr = {
      name: "route",
    };

    const wrapperEl = shallowRef(null);
    const scrolling = (e) => {
      const expanded = e.target.scrollTop < 40;
      store.commit("ui/setNavSize", { expanded });
    };
    const option = {
      passive: true,
    };
    onMounted(() => {
      const el = wrapperEl.value;
      el.addEventListener("scroll", scrolling, option);
    });
    onUnmounted(() => {
      const el = wrapperEl.value;
      el.removeEventListener("scroll", scrolling, option);
    });
    return { wrapperEl, route, tr, menuVisible, topPadding };
  },
};
</script>
<style lang="scss">
@import "~@/assets/resizer";
#app {
  font-family: "Noto Sans KR", Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  position: relative;
}
.app-wrapper {
  overflow-y: auto;
  height: 100%;

  &.no-padding {
    padding-top: 0;
  }
  $dur: 0.2s;
  .route-enter-from {
    opacity: 0;
  }
  .route-enter-active {
    transition: opacity $dur ease-out;
  }

  .route-leave-to {
    opacity: 0;
  }
  .route.leave-active {
    transition: opacity $dur ease-in;
  }

  .nav-enter-from {
    opacity: 0;
    transform: translateY(0px);
  }
  .nav-enter-active {
    transition: all $dur ease-out;
  }

  .nav-leave-to {
    opacity: 0;
    transform: translateY(0px);
  }
  .nav.leave-active {
    transition: tranform $dur ease-in;
  }
}

@include mobile {
  .app-wrapper {
    padding-top: 120px;
  }
}
@include tablet {
  .app-wrapper {
    padding-top: 120px;
  }
}
@include desktop {
  .app-wrapper {
    padding-top: 120px;
  }
}
</style>
