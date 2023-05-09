<template>
  <Background />
  <div class="app-wrapper" ref="wrapperEl">
    <Nav v-if="route.path == '/level' || route.path == '/book'" ref="nav" />
    <LayoutWrapper>
      <router-view v-slot="{ Component }">
        <transition
          :name="tr.name"
          mode="out-in"
          :duration="{ enter: 300, leave: 0 }"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </LayoutWrapper>
  </div>
  <RefreshView v-if="refreshRequired" />
  <MenuWrapper v-if="menuVisible" />
  <teleport to="body" v-if="modalConfig" :key="modalConfig.comp">
    <Modal
      @hidden="hideModal"
      :fill="modalConfig.fill"
      :rect="modalConfig.rect"
      :width="modalConfig.width"
      :noBgc="modalConfig.noBgc"
      :noShadow="modalConfig.noShadow"
      :padding="modalConfig.padding"
      :height="modalConfig.height"
    >
      <component
        :is="modalConfig.comp"
        v-bind="{ ...modalConfig.props }"
        v-on="{ ...modalConfig.events }"
        @close="hideModal"
      ></component>
    </Modal>
  </teleport>
  <ToastUI />
</template>
<script>
import env from "@/service/env";
import { logger } from "@/service/util";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { computed, onMounted, ref, shallowRef, watch } from "vue";
import Nav from "@/views/Nav.vue";
import Background from "./views/Background.vue";
import MenuWrapper from "./views/menu/MenuWrapper.vue";
import RefreshView from "./views/RefreshView.vue";
import ToastUI from "./components/toast/ToastUI.vue";
import CompanyInfo from "./components/company/CompanyInfo.vue";
import LayoutWrapper from "./components/layout/LayoutWrapper.vue";
import util from "./service/util";

export default {
  components: {
    Nav,
    Background,
    MenuWrapper,
    RefreshView,
    ToastUI,
    CompanyInfo,
    LayoutWrapper,
  },
  setup() {
    logger.log(env);
    const store = useStore();
    const menuVisible = computed(() => store.getters["ui/leftVisible"]);
    const topPadding = computed(() => store.getters["ui/topPadding"]);
    const refreshRequired = computed(() => store.state.config.refreshing);
    const route = useRoute();
    const companyVisible = ref(false);
    const modalConfig = computed(() => store.getters["modal/currentModal"]);
    const visiblePathes = [/^\/$/, /^\/policy.*/];
    const tr = {
      name: "route",
    };

    const wrapperEl = shallowRef(null);

    // eslint-disable-next-line no-unused-vars
    const captureHeight = () => {
      const h = window.visualViewport.height;
      // store.commit("ui/setAppHeight", h);
      document.body.style.height = `${h}px`;
    };
    const installHeightResizer = () => {
      window.visualViewport.addEventListener("resize", captureHeight);
      captureHeight();
    };
    const hideModal = () => store.commit("modal/popModal");

    watch(
      () => route.path,
      (path) => {
        const matched = visiblePathes.filter((regex) => regex.test(path));
        companyVisible.value = matched.length > 0;
        if (companyVisible.value && wrapperEl.value) {
          wrapperEl.value.scrollTop = 0;
        }
        const pathes = util.vue.parsePath(route);
        store.commit("ui/setTheme", pathes);
      },
      { immediate: true }
    );
    watch(modalConfig, (config) => {
      console.log("[modal]", config);
    });
    onMounted(() => {
      google.charts.load("50", { packages: ["corechart"] });
      installHeightResizer();
    });
    return {
      refreshRequired,
      wrapperEl,
      route,
      tr,
      menuVisible,
      topPadding,
      modalConfig,
      companyVisible,
      hideModal,
    };
  },
};
</script>
<style lang="scss">
@import "~@/assets/resizer";
#app {
  font-family: "Nanum Gothic", "Noto Sans KR", Avenir, Helvetica, Arial,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  position: relative;
}
.app-wrapper {
  overflow-y: auto;
  height: 100%;
  display: flex;
  flex-direction: column;

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
</style>
