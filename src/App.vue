<template>
  <!-- <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </div> -->
  <Background />
  <div class="app-wrapper">
    <transition name="nav">
      <Nav v-if="route.path !== '/'" ref="nav" />
    </transition>
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
</template>
<script>
import { useRoute } from "vue-router";
import Nav from "@/views/Nav.vue";
import Background from "./views/Background.vue";
export default {
  components: {
    Nav,
    Background,
  },
  setup() {
    const route = useRoute();
    console.log(route.path, route.params);
    const tr = {
      name: "route",
    };
    return { route, tr };
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
  // background-image: url("~@/assets/bg00.jpg");
  background-size: 200%;
  background-position: 100% 100%;

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
    transform: translateY(-200px);
  }
  .nav-enter-active {
    transition: all $dur ease-out;
  }

  .nav-leave-to {
    opacity: 0;
    transform: translateY(-200px);
  }
  .nav.leave-active {
    transition: tranform $dur ease-in;
  }
}

@include mobile {
  .app-wrapper {
    padding-top: 5rem;
  }
}
@include tablet {
  .app-wrapper {
    padding-top: 9rem;
  }
}
@include desktop {
  .app-wrapper {
    padding-top: 8rem;
  }
}
</style>
