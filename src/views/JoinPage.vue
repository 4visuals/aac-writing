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
        <WelcomeManualJoin v-if="userRef" :user="userRef" key="welcome" />
        <ManualJoinForm v-else @join="onJoinCompleted" key="form" />
      </transition>
    </WidthLayout>
    <CompanyInfoDark />
  </div>
</template>

<script>
import TeacherNav from "./nav/TeacherNav.vue";
import Jumbotron from "../components/Jumbotron.vue";
import ManualJoinForm from "./ManualJoinForm.vue";
import WidthLayout from "../components/layout/WidthLayout.vue";
import WelcomeManualJoin from "./user/WelcomeManualJoin.vue";
// import api from "../service/api";
// import toast from "../components/toast";

import { useStore } from "vuex";
import CompanyInfoDark from "../components/company/CompanyInfoDark.vue";
import { ref } from "vue";

export default {
  components: {
    Jumbotron,
    TeacherNav,
    CompanyInfoDark,
    ManualJoinForm,
    WidthLayout,
    WelcomeManualJoin,
  },
  setup() {
    const store = useStore();
    const userRef = ref(null);

    const onJoinCompleted = (user) => {
      userRef.value = user;
    };
    store.commit("ui/setBackgroundVisible", false);
    return { userRef, onJoinCompleted };
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
