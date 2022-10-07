<template>
  <div class="home">
    <button v-if="member" class="btn logout" @click="doLogout">
      <span>로그</span><span>아웃</span>
    </button>
    <div class="menu">
      <div class="logo main"></div>
      <div class="logo sub"></div>
    </div>
    <!-- <h1 class="main title">받아쓰기</h1> -->

    <div class="menu" v-if="host.isPwaMode()">
      <AacButton text="시작" theme="pink" @click="moveTo('/level')" />
    </div>
    <div class="menu" v-else-if="host.isTeacherMode()">
      <div class="students" v-if="member">
        <template v-if="students.length === 0">
          <ParaText
            >학생을 등록해주세요. 최대 2명까지 등록 가능합니다.</ParaText
          >
          <div class="stud-reg">
            <AacButton
              text="학생 등록"
              theme="pink"
              :inline="true"
              @click="showLicenseConfig"
            />
          </div>
        </template>
        <template v-else>
          <StudentList
            @selected="(license, path) => moveTo(path, license)"
            @register="(license) => showLicenseConfig(license)"
          />
        </template>
      </div>
      <div class="login" v-else>
        <UserProfile class="google" />
      </div>
    </div>
    <div class="menu" v-else>
      <StudentLoginForm />
    </div>
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
import UserProfile from "./menu/UserProfile.vue";
import { useStore } from "vuex";
import { watch, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { computed } from "@vue/reactivity";
import { LicenseConfigView } from "@/components/admin";
import { SpanText, ParaText } from "@/components/text";
import { ActionIcon } from "../components/form";
import StudentList from "./main/StudentList.vue";

export default {
  name: "Home",
  components: {
    StudentLoginForm,
    UserProfile,
    LicenseConfigView,
    SpanText,
    ParaText,
    ActionIcon,
    StudentList,
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
      router.replace(url);
      store.commit("ui/setNavSize", { expanded: false, topPadding: 120 });
    };
    const showLicenseConfig = (lcs) => {
      modal.value.visible = true;
      modal.value.lcs = lcs;
      console.log(licenses);
    };
    const doLogout = () => {
      store.commit("user/logoutUser");
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
    store.commit("ui/setNavSize", { expanded: false, topPadding: 56 });
    store.commit("ui/hideMenu");
    onMounted(() => {});
    return {
      modal,
      member,
      students,
      licenses,
      moveTo,
      showLicenseConfig,
      host,
      doLogout,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "~@/assets/resizer";
@include mobile {
  .home {
    font-size: 2rem;
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
    font-size: 2.5rem;
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
    font-size: 2.5rem;
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
}
</style>
