<template>
  <nav>
    <div class="logo" @click="goTo('/')">
      <!-- <img src="/img/bdsg_logo_sm.png" alt="" srcset="" /> -->
    </div>
    <div class="items">
      <ul class="nude hor">
        <!-- <li>
          <button class="nude" @click="goTo('/')">
            <span>그림한글 받아쓰기</span>
          </button>
        </li> -->
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
@import "~@/assets/resizer";
nav {
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background-color: white;
  box-shadow: 0 0 16px #0000002d, 0 0 8px #0000004d;
  z-index: 100;
  .logo {
    width: 180px;
    height: 36px;
    background-image: url("/img/bdsg_logo_sm.png");
    background-size: 180px 36px;
    background-repeat: no-repeat;
    background-position: left center;
    transition: width 0.2s cubic-bezier(0.22, 0.61, 0.36, 1);
    cursor: pointer;
    > img {
      width: 100%;
      height: auto;
    }
    @include mobile {
      width: 28px;
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
