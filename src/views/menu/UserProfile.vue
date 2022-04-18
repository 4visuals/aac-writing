<template>
  <div class="user-profile" @click="resolveClick">
    <div class="blocked chip rounded border">
      <Logo
        class="logo"
        :imagePath="
          membership
            ? membership.image
            : require('@/assets/logo/logo_google.svg')
        "
        size="xs"
      />
      <div class="text row-2" v-if="membership">
        <div class="name">{{ membership.profile.name }}님</div>
        <div class="email">{{ membership.profile.email }}</div>
      </div>
      <div class="text" v-else>Google 계정으로 로그인</div>
      <ActionIcon class="setting" v-if="membership" icon="settings" />
    </div>
    <teleport to="body" v-if="modalVisible">
      <Modal width="sm" @hidden="closeJoinModal" v-if="joinRequired()">
        <JoinView :membership="membership" />
      </Modal>
      <Modal width="sm" @hidden="() => {}" v-if="showWelcome">
        <WelcomeJoin />
      </Modal>
    </teleport>
  </div>
</template>

<script>
import env from "@/service/env";
import Logo from "@/components/oauth/Logo.vue";
import JoinView from "@/views/user/JoinView.vue";
import WelcomeJoin from "@/views/user/WelcomeJoin.vue";
import { Modal } from "@/components";
import { ActionIcon } from "@/components/form";
import { useStore } from "vuex";
import { computed, ref } from "@vue/runtime-core";
export default {
  components: {
    Logo,
    Modal,
    JoinView,
    ActionIcon,
    WelcomeJoin,
  },
  setup() {
    const store = useStore();
    const membership = computed(() => store.state.user.membership);
    const modalVisible = ref(false);
    const showWelcome = computed(() => store.state.user.welcome);
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
      membership,
      modalVisible,
      showWelcome,
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
  width: 100%;
  .detail {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
  }
  .chip {
    position: relative;
    display: flex;
    align-items: center;
    padding: 6px 12px;
    cursor: pointer;
    &.blocked {
      width: 100%;
    }
    &.rounded {
      border-radius: 4px;
    }
    &.border {
      border: 1px solid #ccc;
    }
    &:hover {
      border-color: #d2e3fc;
      background-color: rgba(66, 133, 244, 0.04);
    }
    .text {
      margin: 0 12px;
      font-size: 1rem;
      flex: 1 1 auto;
      overflow: hidden;
      & > div {
        overflow-x: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .name {
        font-weight: 500;
        color: #3c4043;
      }
      .email {
        color: #5f6368;
        font-size: 0.85rem;
      }
    }
    .setting {
      color: #636363;
      font-size: 20px;
    }
  }
}
</style>
