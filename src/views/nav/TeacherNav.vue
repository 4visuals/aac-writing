<template>
  <header :class="{ fixed: fixed }">
    <a class="brand" href="/">
      <div class="logo">
        <span class="b">ㄱ</span><span class="y">ㄹ</span
        ><span class="d">ㅎ</span><span class="b">ㄱ</span>
      </div>
      <strong>그림한글</strong>
    </a>
    <nav>
      <div class="inline">
        <router-link class="btn" to="/support">소개</router-link>
      </div>
      <div class="inline">
        <router-link class="btn" to="/purchase">이용권 구매</router-link>
      </div>
      <div class="inline" v-if="member">
        <BadgeIcon :icon="member.image" :text="member.user.name" />
        <a class="btn" href="#" @click.prevent="tryLogOut">로그아웃</a>
      </div>
      <div class="inline" v-else>
        <a class="btn" href="#">가입</a>
        <GoogleButton size="small" text="signin" class="g btn" />
      </div>
      <a class="btn menu" href="#"><AppIcon icon="menu" fsize="20px" /></a>
    </nav>
  </header>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import modal from "../../components/modal";
import DialogView from "../../components/dialog/DialogView.vue";
import AppIcon from "../../components/AppIcon.vue";
import GoogleButton from "../../components/oauth/GoogleButton.vue";
import BadgeIcon from "../../components/BadgeIcon.vue";
export default {
  props: ["fixed"],
  components: {
    AppIcon,
    BadgeIcon,
    GoogleButton,
  },
  setup() {
    const store = useStore();
    const member = computed(() => store.state.user.membership);

    const doLogout = (cmd) => {
      if (cmd === "yes") {
        const { email } = member.value;
        store.commit("user/logoutUser");
        window.google.accounts.id.revoke(email, (res) => {
          console.log("[DONE]", res);
        });
      }
      modal.closeModal();
    };

    const tryLogOut = () => {
      store.commit("ui/hideMenu");
      modal.showModal(DialogView, {
        width: "sm",
        props: {
          title: "로그아웃",
          message: "로그아웃 합니까?",
          actions: [
            { cmd: "yes", text: "네, 로그아웃합니다" },
            { cmd: "no", text: "아니오" },
          ],
        },
        events: { commit: doLogout },
      });
    };
    return { member, tryLogOut };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
$navheight: 3.5rem;
$bgcolor: #fffdf46d;
header {
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: $navheight;
  background-color: transparent;

  padding: 0 8px;
  z-index: 5;

  &.fixed {
    position: fixed;
    background-color: $bgcolor;
    z-index: 30;
    box-shadow: 0px 0px 4px #0000004d;
    animation: menuscroll 0.6s;
  }
  nav {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    column-gap: 8px;
    .inline {
      display: flex;
      align-items: center;
      column-gap: 8px;
      font-size: 14px;
      font-weight: 600;
      .g.btn {
        margin-right: 4px;
      }
    }
  }
  a {
    color: inherit;
    text-decoration: none;
    line-height: 1;
    &.btn {
      padding: 4px;
    }
    &.menu {
      display: none;
    }
  }
  a.brand {
    display: flex;
    align-items: center;
    column-gap: 8px;
    .logo {
      display: flex;
      flex-wrap: wrap;
      width: 24px;
      height: 24px;
      user-select: none;
      span {
        width: 50%;
        height: 50%;
        line-height: 1;
        font-size: 14px;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        &.b {
          background-color: #444;
          color: #ccc;
        }
        &.r {
          background-color: crimson;
          color: white;
        }
        &.y {
          background-color: rgb(255, 247, 0);
        }
        &.d {
          background-color: rgb(162, 223, 255);
        }
      }
    }
    strong {
      font-size: 20px;
    }
  }
  @keyframes menuscroll {
    0% {
      top: -52px;
    }
    100% {
      top: 0;
    }
  }
}
@include mobile {
  header {
    nav {
      .inline {
        display: none;
      }
      a.btn.menu {
        display: block;
      }
    }
  }
}
</style>
