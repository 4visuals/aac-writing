<template>
  <nav>
    <div class="logo" @click="goTo('/')">
      <img src="/img/bdsg_logo_sm.png" alt="" srcset="" />
    </div>
    <div class="items">
      <ul class="nude hor">
        <li>
          <button class="nude" @click="goTo('/')">
            <span>그림한글 받아쓰기</span>
          </button>
        </li>
        <li>
          <button class="nude purchase" @click="goTo('/purchase')">
            <span>구매하기</span>
          </button>
        </li>
        <li v-if="loginUser">
          <button class="nude" @click="goTo('/setting')">
            <span>마이페이지</span>
          </button>
        </li>
        <li v-if="loginUser">
          <button class="nude" @click="delegateLogout">
            <span>로그아웃</span>
          </button>
        </li>
        <li v-else>
          <button class="nude" @click="startGoogleLogin">
            <span>로그인</span>
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { computed, inject } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import google from "@/components/oauth/google";
import modal from "@/components/modal";
import DialogView from "@/components/dialog/DialogView.vue";
import JoinView from "@/views/user/JoinView.vue";

export default {
  setup() {
    const store = useStore();
    const loginUser = computed(() => store.getters["user/currentUser"]);
    const membership = computed(() => store.state.user.membership);
    const router = useRouter();
    const appProvider = inject("appProvider");
    const goTo = (uri) => router.push(uri);

    // FIXME 로그인 후 가입 화면 보여주는 로직도 App.vue로 올리고 provide-inject로 호출함
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

    const startGoogleLogin = () => {
      google.initGoogleSignIn(handleLoginRespone, true);
    };
    const delegateLogout = () => appProvider.logout();
    return { loginUser, goTo, startGoogleLogin, delegateLogout };
  },
};
</script>

<style lang="scss" scoped>
nav {
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: white;
  box-shadow: 0 0 16px #0000002d, 0 0 8px #0000004d;
  z-index: 100;
  .logo {
    width: 180px;
    > img {
      width: 100%;
      height: auto;
    }
  }
  .items {
    flex: 1 1 auto;
    justify-content: flex-end;
    display: flex;
    button {
      &.purchase {
        border: 2px solid #1db270;
        color: #1db270;
        line-height: 1;
        border-radius: 20px;
      }
    }
  }
}
</style>
