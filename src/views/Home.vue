<template>
  <div class="home">
    <div class="home-nav" v-if="host.isTeacherMode()">
      <router-link class="link" to="/support">소개</router-link>
      <!-- <router-link to="/join" v-if="!member">가입</router-link> -->
      <router-link class="link" to="/purchase">이용권구매</router-link>
      <router-link v-if="member" class="link" to="/setting"
        >마이페이지</router-link
      >
      <button class="nude guide" @click="showVideoGuid">
        <AppIcon icon="play_circle_filled" /><span>가입안내</span>
      </button>
      <router-link v-if="member && member.admin" class="link" to="/console"
        >콘솔</router-link
      >
    </div>
    <button v-if="member" @click="delegateLogout" class="nude btn logout">
      <span>로그아웃</span>
    </button>
    <div class="menu top">
      <div class="logo"></div>
    </div>
    <div v-if="host.isPwaMode()" class="menu">
      <AacButton text="시작" theme="pink" @click="moveTo('/level')" />
    </div>
    <div v-else-if="host.isTeacherMode()" class="menu">
      <ParaText
        >학생 등록 후
        <a class="btn student" href="https://student.kdict.kr">학생 로그인</a>
        에서 학습을 시작할 수 있습니다.
      </ParaText>
      <!--로그인 화면-->
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
      <div v-else class="login">
        <GoogleButton @join="showNotAMemberDialog" />
        <!-- <div class="hr"></div>
        <button class="btn" @click="showJoinForm">회원 가입</button> -->
      </div>
      <div class="notice">
        <div class="info">
          <ParaText>가입 시 7일간 무료체험(개인)!!</ParaText>
        </div>
        <div class="info">
          <ParaText>그림으로 시작하고 교과서로 다지는</ParaText>
          <ParaText>그림한글 받아쓰기</ParaText>
        </div>
      </div>
    </div>
    <div v-else class="menu">
      <StudentLoginForm />
    </div>
    <CompanyInfo v-if="!member" />
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
import { useStore } from "vuex";
import { watch, ref, onMounted, inject } from "vue";
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
import { loadStudentRecords } from "./app-state-validator";
import JoinView from "./user/JoinView.vue";
import TutorialVideoView from "../components/TutorialVideoView.vue";

export default {
  name: "Home",
  components: {
    StudentLoginForm,
    LicenseConfigView,
    SpanText,
    ParaText,
    ActionIcon,
    StudentList,
    GoogleButton,
    CompanyInfo,
    // JoinView,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const students = computed(() => store.getters["user/students"]);
    const licenses = computed(() => store.state.user.membership.licenses);
    const member = computed(() => store.getters["user/isMember"]);
    const membership = computed(() => store.state.user.membership);
    const modal = ref({ visible: false, lcs: null });

    const appProvider = inject("appProvider");
    const moveTo = (url, license) => {
      store.commit("exam/setActiveLicense", license);
      loadStudentRecords({ store, license }).then(() => {
        router.replace(url);
      });
    };
    const goTo = (uri) => {
      router.push(uri);
    };
    const delegateLogout = () => appProvider.logout();
    /**
     * 구글 로그인 버튼 누른 후 회원이 아니면 보여주는 팝업
     */
    const showNotAMemberDialog = () => {
      modals.showModal(DialogView, {
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
            modals.closeModal();
            if (cmd === "yes") {
              showJoinForm();
            }
          },
        },
      });
    };

    const showJoinForm = () => {
      modals.showModal(JoinView, {
        width: "sm",
        props: { membership },
        events: {
          commit: (cmd) => {
            modals.closeModal();
            console.log(cmd);
          },
        },
      });
    };
    const showVideoGuid = () => {
      modals.showModal(TutorialVideoView, {
        width: "lg",
        padding: "0px",
        props: { videoUrl: "ULJj9PJIzGM?si=r5NwKZRbOXfWDXTI" },
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
      delegateLogout,
      showNotAMemberDialog,
      showJoinForm,
      showVideoGuid,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "~@/assets/resizer";
@include mobile {
  .home {
    // font-size: 2rem;
    .menu.top {
      margin-top: 20vmin;
    }
    .logo {
      height: 240px;
    }
  }
}
@include tablet {
  .home {
    .menu.top {
      margin-top: 12vmin;
    }
    // font-size: 2.5rem;
    .logo {
      height: 400px;
    }
  }
}
@include desktop {
  .home {
    .menu.top {
      margin-top: 10vmin;
    }
    // font-size: 2.5rem;
    .logo {
      height: 400px;
    }
  }
}
.home {
  height: 100%;
  padding: 0 24px;
  position: relative;
  background-color: #d2ecfd;
  .home-nav {
    display: flex;
    font-size: 1.15rem;
    position: fixed;
    top: 16px;
    left: 16px;
    column-gap: 8px;
    font-family: "NanumSquareRound", "Noto Sans KR", sans-serif;
    font-weight: 600;
    a {
      color: #648294;
      font-weight: 600;
      text-decoration: none;
    }
    .guide {
      display: inline-flex;
      align-items: center;
      padding: 0;
      color: #003b5f;
      border: 1px solid;
      padding: 0 8px 0 1px;
      border-radius: 24px;
      &:active {
        transform: translate(1px, 1px);
      }
    }
  }
  .btn {
    font-size: 1rem;
    border-radius: 20px;
    &.logout {
      position: fixed;
      top: 8px;
      right: 8px;
      background-color: #32393d;
      color: white;
    }
    &.student {
      display: inline-flex;
      padding: 4px 8px;
      text-decoration: none;
      background-color: darkgreen;
      color: white;
    }
  }

  .logo {
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url("/img/logo/main-logo.svg");
  }
  .login {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 2rem auto;
    max-width: 300px;
  }
  .title {
    font-family: "Roboto", sans-serif;
    &.main {
      font-size: 2em;
    }
  }
  .menu {
    max-width: 480px;
    margin: 0 auto;
    width: 100%;
    .students {
      margin-top: 8px;
      .stud-reg {
        margin: 24px 0;
        display: flex;
        align-items: center;
        flex-direction: column;
      }
    }
    .notice {
      .info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      .info + .info {
        margin-top: 16px;
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
