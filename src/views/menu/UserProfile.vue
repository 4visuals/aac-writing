<template>
  <div class="user-profile" @click="resolveClick">
    <Logo
      class="logo"
      :imagePath="membership && membership.image"
      :vendor="membership ? membership.vendor : 'guest'"
      size="sm"
    />
    <div class="detail" v-if="membership">
      <ParaText>{{ membership.profile.name }}님</ParaText>
    </div>
    <p v-else><ParaText>로그인</ParaText></p>
    <teleport to="body" v-if="modalVisible && joinRequired()">
      <Modal width="sm" @hidden="closeJoinModal">
        <JoinView :membership="membership" />
      </Modal>
    </teleport>
  </div>
</template>

<script>
import env from "@/service/env";
import Logo from "@/components/oauth/Logo.vue";
import JoinView from "@/views/user/JoinView.vue";
import { ParaText } from "@/components/text";
import { Modal } from "@/components";
import { useStore } from "vuex";
import { computed, ref } from "@vue/runtime-core";
export default {
  components: {
    Logo,
    Modal,
    ParaText,
    JoinView,
  },
  setup() {
    const store = useStore();
    const gbtn = ref(null);
    const membership = computed(() => store.state.user.membership);
    const modalVisible = ref(false);
    const handleCredentialResponse = (res) => {
      store
        .dispatch("user/checkMembership", {
          vendor: "google",
          token: res.access_token,
          type: "access_token",
        })
        .then((membership) => {
          modalVisible.value = !membership.user;
        });
    };

    const { google } = window;
    const client = google.accounts.oauth2.initTokenClient({
      client_id: env.GOOGLE_CLIENT_ID,
      scope:
        "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid",
      ux_mode: "popup",
      callback: handleCredentialResponse,
    });

    const login = () => {
      // client.requestCode();
      client.requestAccessToken();
    };

    const resolveClick = () => {
      if (membership.value) {
        console.log("사용자 정보");
      } else {
        login();
      }
    };
    /**
     * 이메일은 존재하지만 회원이 아닌 상태
     */
    const joinRequired = () => membership.value && !membership.value.user;
    const closeJoinModal = () => {
      modalVisible.value = false;
    };
    return {
      gbtn,
      membership,
      modalVisible,
      resolveClick,
      joinRequired,
      closeJoinModal,
    };
  },
};
</script>

<style lang="scss" scoped>
.user-profile {
  display: flex;
  flex: 1 1 auto;
  .detail {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
  }
}
</style>
