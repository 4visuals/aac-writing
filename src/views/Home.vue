<template>
  <div class="home">
    <div class="home-nav" v-if="host.isTeacherMode()">
      <router-link to="/support">소개</router-link>
      <router-link to="/join" v-if="!member">가입</router-link>
      <router-link to="/purchase">이용권구매</router-link>
    </div>
    <button v-if="member" class="btn logout" @click="doLogout">
      <span>로그</span><span>아웃</span>
    </button>
    <div class="menu" style="margin-top: 20vmin">
      <div class="logo main"></div>
      <div class="logo sub"></div>
    </div>
    <div class="menu" v-if="host.isPwaMode()">
      <AacButton text="시작" theme="pink" @click="moveTo('/level')" />
    </div>
    <div class="menu" v-else-if="host.isTeacherMode()">
      <div class="students" v-if="member">
        <template v-if="students.length === 0">
          <div class="stud-reg">
            <ParaText class="mgb-16px">학생을 등록할 수 있습니다.</ParaText>
            <AacButton
              text="학생 등록"
              theme="pink"
              :inline="true"
              @click="goTo('/setting/student')"
            />
          </div>
        </template>
        <StudentList
          @selected="(license, path) => moveTo(path, license)"
          @register="goTo('/setting/student')"
        />
      </div>
      <div class="login" v-else>
        <GoogleButton @join="showJoinDialog" />
        <!-- <div class="hr"><span>OR</span></div>
        <ManualLoginForm /> -->
      </div>
    </div>
    <div class="menu" v-else>
      <StudentLoginForm />
    </div>
    <CompanyInfo />
    <teleport to="body" v-if="modal.visible">
      <Modal @hidden="modal.visible = false" :fill="true" :rect="true">
        <ModalHeader :shadow="true"
          ><ActionIcon
            icon="arrow_back"
            @click="modal.visible = false"
          ></ActionIcon
          ><SpanText>학생 등록</SpanText></ModalHeader
        >
        <LicenseConfigView
          :license="modal.lcs"
          :licenses="licenses"
          :students="students"
        />
      </Modal>
    </teleport>
  </div>
</template>

<script>
import { host } from "@/service/util";
import StudentLoginForm from "./StudentLoginForm.vue";
// import ManualLoginForm from "./ManualLoginForm.vue";
// import UserProfile from "./menu/UserProfile.vue";
import { useStore } from "vuex";
import { watch, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { computed } from "@vue/reactivity";
import { LicenseConfigView } from "@/components/admin";
import { SpanText, ParaText } from "@/components/text";
import { ActionIcon } from "../components/form";
import StudentList from "./main/StudentList.vue";
import GoogleButton from "../components/oauth/GoogleButton.vue";
import CompanyInfo from "../components/company/CompanyInfo.vue";
import modals from "@/components/modal";
import DialogView from "@/components/dialog/DialogView.vue";

export default {
  name: "Home",
  components: {
    StudentLoginForm,
    // ManualLoginForm,
    // UserProfile,
    LicenseConfigView,
    SpanText,
    ParaText,
    ActionIcon,
    StudentList,
    GoogleButton,
    CompanyInfo,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const students = computed(() => store.getters["user/students"]);
    const licenses = computed(() => store.state.user.membership.licenses);
    const member = computed(() => store.getters["user/isMember"]);
    const modal = ref({ visible: false, lcs: null });
    const moveTo = (url, license) => {
      // console.log("move to ", url);
      store.commit("exam/setActiveLicense", license);
      store.dispatch("record/prefetch", license.studentRef).then(() => {
        router.replace(url);
      });
    };
    const goTo = (uri) => {
      router.push(uri);
    };
    const doLogout = () => {
      store.commit("user/logoutUser");
    };
    const showJoinDialog = () => {
      modals.showModal(DialogView, {
        width: "sm",
        props: {
          title: "회원이 아닙니다.",
          message: "회원가입 후 이용 가능합니다.",
          actions: [
            { cmd: "yes", text: "가입 페이지로 이동합니다." },
            { cmd: "no", text: "취소" },
          ],
        },
        events: {
          commit: (cmd) => {
            modals.closeModal();
            if (cmd === "yes") {
              goTo("/join");
            }
          },
        },
      });
    };

    watch(
      () => member,
      (isMember) => {
        if (isMember) {
          console.log("move to level");
        }
      },
      { immediate: true }
    );
    store.commit("ui/hideMenu");
    onMounted(() => {});
    return {
      modal,
      member,
      students,
      licenses,
      moveTo,
      goTo,
      host,
      doLogout,
      showJoinDialog,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "~@/assets/resizer";
@include mobile {
  .home {
    // font-size: 2rem;
    .logo {
      height: 75px;
      &.sub {
        height: 60px;
      }
    }
  }
}
@include tablet {
  .home {
    // font-size: 2.5rem;
    .logo {
      height: 120px;
      &.sub {
        height: 100px;
      }
    }
  }
}
@include desktop {
  .home {
    // font-size: 2.5rem;
    .logo {
      height: 120px;
      &.sub {
        height: 100px;
      }
    }
  }
}
.home {
  height: 100%;
  padding: 0 24px;
  position: relative;
  .home-nav {
    display: flex;
    font-size: 1.5rem;
    position: fixed;
    top: 16px;
    left: 16px;
    column-gap: 16px;
    a {
      text-decoration: none;
    }
  }
  .logout {
    width: 48px;
    height: 48px;
    background-color: crimson;
    color: white;
    position: fixed;
    top: 16px;
    right: 16px;
    font-size: 1.1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: none;
    border-radius: 24px;
  }

  .logo {
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    margin-bottom: 32px;
    &.main {
      background-image: url("/img/white_back_02.png");
    }
    &.sub {
      background-image: url("/img/badassgi.png");
    }
  }
  .login {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 4rem auto;
    max-width: 300px;
  }
  .title {
    font-family: "Roboto", sans-serif;
    &.main {
      font-size: 2em;
    }
    &.sub {
      font-size: 1em;
      color: #146b27;
    }
  }
  .menu {
    max-width: 480px;
    margin: 0 auto;
    width: 100%;
    .students {
      margin-top: 24px;
      .stud-reg {
        margin: 24px 0;
        display: flex;
        align-items: center;
        flex-direction: column;
      }
    }
  }
  .hr {
    margin: 16px 0;
    width: 100%;
    text-align: center;
    position: relative;
    display: flex;
    justify-content: center;
    &::before {
      content: "";
      position: absolute;
      top: 50%;
      left: 0;
      height: 2px;
      width: 100%;
      background: linear-gradient(
        90deg,
        #ccc 0px,
        #ccc 2px,
        #fff 2px,
        #fff 6px
      );
      background-size: 6px;
      background-repeat: repeat-x;
      z-index: 0;
    }
    & > span {
      background-color: white;
      z-index: 5;
      position: relative;
      padding: 0 8px;
    }
  }
}
</style>
