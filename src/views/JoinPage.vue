<template>
  <div class="join-page" @scroll="detectScroll">
    <TeacherNav :fixed="fixedMenu" @logout="doLogout" />
    <!-- <ProductBanner v-if="products" :products="products" /> -->
    <Jumbotron title="회원가입" />
    <WidthLayout>
      <div class="status"><h3>회원 가입 시 7일간의 무료 체험</h3></div>
    </WidthLayout>
    <WidthLayout>
      <transition name="trs-scale-grow" mode="out-in">
        <WelcomeJoin v-if="userRef" :user="userRef" key="welcome" />
        <OauthJoinForm
          v-else
          :profile="membership.profile"
          @join="onJoinCompleted"
          key="form"
        />
      </transition>
    </WidthLayout>
    <CompanyInfoDark />
  </div>
</template>

<script>
import TeacherNav from "./nav/TeacherNav.vue";
import Jumbotron from "../components/Jumbotron.vue";
import OauthJoinForm from "./OauthJoinForm.vue";
import WidthLayout from "../components/layout/WidthLayout.vue";
import WelcomeJoin from "./user/WelcomeJoin.vue";
// import api from "../service/api";
// import toast from "../components/toast";

import { useStore } from "vuex";
import CompanyInfoDark from "../components/company/CompanyInfoDark.vue";
import { computed, ref } from "vue";

export default {
  components: {
    Jumbotron,
    TeacherNav,
    CompanyInfoDark,
    OauthJoinForm,
    WidthLayout,
    WelcomeJoin,
  },
  setup() {
    const store = useStore();
    const membership = computed(() => store.state.user.membership);
    const userRef = ref(null);

    const onJoinCompleted = (membership) => {
      userRef.value = membership.user;
    };
    store.commit("ui/setBackgroundVisible", false);
    return { membership, userRef, onJoinCompleted };
  },
};
</script>

<style lang="scss" scoped>
.join-page {
  height: 100%;
  overflow-y: auto;
  .status {
    padding: 0 16px;
    margin-top: 48px;
    margin-bottom: 48px;
    text-align: center;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
}
.scale {
  &-enter-from,
  &-enter {
    opacity: 0;
    transform: scale(0.9);
  }
  &-enter-active,
  &-leave-active {
    transition: opacity 0.2s ease-in, transform 0.2s ease-in;
  }
  &-leave,
  &-leave-to {
    opacity: 0;
    transform: scale(0.9);
  }
}
</style>
