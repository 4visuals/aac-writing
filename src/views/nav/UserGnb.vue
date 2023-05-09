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
          <button class="nude" @click="delegateLogin">
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

export default {
  setup() {
    const store = useStore();
    const loginUser = computed(() => store.getters["user/currentUser"]);
    const router = useRouter();
    const appProvider = inject("appProvider");
    const goTo = (uri) => router.push(uri);
    const delegateLogin = () => appProvider.login();
    const delegateLogout = () => appProvider.logout();
    return { loginUser, goTo, delegateLogin, delegateLogout };
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
