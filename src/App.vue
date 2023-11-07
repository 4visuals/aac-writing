<template>
  <Background />
  <div class="app-wrapper" ref="wrapperEl">
    <Nav v-if="route.path == '/level' || route.path == '/book'" ref="nav" />
    <LayoutWrapper :height="route.path === '/support' ? '100%' : undefined">
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
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { computed, onMounted, ref, shallowRef, watch, provide } from "vue";
import Nav from "@/views/Nav.vue";
import Background from "./views/Background.vue";
import MenuWrapper from "./views/menu/MenuWrapper.vue";
import RefreshView from "./views/RefreshView.vue";
import ToastUI from "./components/toast/ToastUI.vue";
import CompanyInfo from "./components/company/CompanyInfo.vue";
import LayoutWrapper from "./components/layout/LayoutWrapper.vue";
import util from "./service/util";
import googleLogin from "./components/oauth/google";
import modal from "@/components/modal";
import DialogView from "@/components/dialog/DialogView.vue";
import JoinView from "@/views/user/JoinView.vue";

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
    const router = useRouter();
    const companyVisible = ref(false);
    const modalConfig = computed(() => store.getters["modal/currentModal"]);
    const visiblePathes = [/^\/$/, /^\/policy.*/];
    const membership = computed(() => store.state.user.membership);
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

    const showJoinForm = () => {
      modal.showModal(JoinView, {
        width: "sm",
        props: { membership },
        events: {
          commit: () => {
            modal.closeModal();
          },
        },
      });
    };

    const showNotAMemberDialog = () => {
      modal.showModal(DialogView, {
        width: "sm",
        props: {
          align: "center",
          message: "회원이 아닙니다.\n회원가입 후 이용해주세요",
          actions: [
            { cmd: "yes", text: "가입 페이지로 이동" },
            { cmd: "no", text: "취소하기" },
          ],
        },
        events: {
          commit: (cmd) => {
            modal.closeModal();
            if (cmd === "yes") {
              showJoinForm();
            }
          },
        },
      });
    };

    const handleLoginRespone = (res) => {
      store
        .dispatch("user/checkMembership", {
          vendor: "google",
          token: res.credential,
          type: "id_token",
        })
        .then((membership) => {
          if (!membership.user) {
            showNotAMemberDialog();
          }
        });
    };
    /**
     * session이 없는 경우(시크릿칭 또는 구글 로그인 이력이 없는 브라우저)
     */
    const googleSignInFailed = () => {
      const btn = document.querySelector("[data-login-btn]");
      console.log(btn);
      google.accounts.id.renderButton(
        btn,
        { theme: "outline", size: "medium", shape: "pill", text: "signin" } // customization attributes
      );
    };
    const startGoogleLogin = () => {
      googleLogin.initGoogleSignIn(
        handleLoginRespone,
        googleSignInFailed,
        true
      );
    };

    const doLogout = (cmd) => {
      if (cmd === "yes") {
        store.commit("user/logoutUser");
        router.replace("/");
      }
      modal.closeModal();
    };

    const confirmLogout = () => {
      modal.showModal(DialogView, {
        width: "sm",
        props: {
          title: "로그아웃",
          message: "로그아웃합니까?",
          actions: [
            { cmd: "yes", text: "네, 로그아웃합니다" },
            { cmd: "no", text: "아니오" },
          ],
        },
        events: { commit: doLogout },
      });
    };

    provide("appProvider", {
      logout: confirmLogout,
      login: startGoogleLogin,
    });

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
