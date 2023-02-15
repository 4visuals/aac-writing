<template>
  <WidthLayout maxWidth="1190px" :fixed="true">
    <div
      v-if="nav.visible"
      class="nav-bar"
      :style="`--bg-color: ${themeRef.bgc}`"
    >
      <div class="btn-menu left" @click="gotoMain"></div>
      <div class="btn-menu mid">
        <AppButton
          size="nav"
          text="단계별"
          borderWidth="2px"
          :theme="themeRef.name"
          :borderColor="themeRef.color.main"
          :fill="themeRef.name === 'blue'"
          @click="changeCourse(0)"
        /><AppButton
          size="nav"
          text="교과서"
          borderWidth="2px"
          :borderColor="themeRef.color.sub"
          :theme="themeRef.name"
          :fill="themeRef.name === 'brown'"
          @click="changeCourse(1)"
        />
        <AppButton
          text="평가보기"
          theme="none"
          @click="openStatView"
        ></AppButton>
      </div>
      <div class="btn-menu right">
        <button class="nude mobile" @click="mobileMenuVisible = true">
          <AppIcon class="folding-menu" icon="menu" fsize="24px" />
        </button>
        <StudentLogo v-if="!policyPage" :student="student" size="lg" />
      </div>
      <div v-if="mobileMenuVisible" class="mobile-menu">
        <div class="modal-dimmer" @click="setMenuVisible(false)"></div>
        <div class="inner">
          <AppButton
            size="sm"
            text="단계별"
            borderWidth="2px"
            :theme="themeRef.name"
            :borderColor="themeRef.color.main"
            :fill="themeRef.name === 'blue'"
            @click="changeCourse(0)"
          /><AppButton
            size="sm"
            text="교과서"
            borderWidth="2px"
            :borderColor="themeRef.color.sub"
            :theme="themeRef.name"
            :fill="themeRef.name === 'brown'"
            @click="changeCourse(1)"
          />
          <AppButton
            size="sm"
            text="평가보기"
            theme="nav"
            @click="openStatView"
          ></AppButton>
          <div class="close">
            <button class="nude btn-close" @click="setMenuVisible(false)">
              <AppIcon icon="close" fsize="24px" /><span>닫기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </WidthLayout>
</template>

<script>
import StudentLogo from "@/components/StudentLogo.vue";
import { useStore } from "vuex";
import { computed, ref } from "@vue/runtime-core";
import { useRoute, useRouter } from "vue-router";
import WidthLayout from "../components/layout/WidthLayout.vue";
import AcademicProgressView from "@/components/stats/AcademicProgressView.vue";
import modal from "@/components/modal";

export default {
  components: {
    // ActionIcon,
    StudentLogo,
    WidthLayout,
  },
  setup() {
    const store = useStore();
    const nav = computed(() => store.getters["ui/nav"]);
    const route = useRoute();
    const router = useRouter();
    const loginUser = computed(() => store.getters["user/currentUser"]);

    const isStudent = computed(() => store.getters["user/isStudent"]);
    const ctx = computed(() => store.state.quiz.quizContext);

    const topPadding = computed(() => store.getters["ui/topPadding"]);
    const policyPage = computed(() => route.path.startsWith("/policy"));
    const student = computed(() => store.getters["exam/student"]);

    const themeRef = computed(() => store.state.ui.theme);
    const section = ref(null);
    const mobileMenuVisible = ref(false);
    const courses = [
      {
        name: "level",
        path: "/level",
        text: "단계별 받아쓰기",
        theme: { color: "#d23d70", bgc: "#ffe1ea" },
      },
      {
        name: "book",
        path: "/book",
        text: "교과서 받아쓰기",
        theme: { color: "#865900", bgc: "#ffec88" },
      },
    ];
    const setMenuVisible = (visible) => (mobileMenuVisible.value = visible);
    const changeCourse = (idx) => {
      router.replace(courses[idx].path);
      setMenuVisible(false);
    };
    const openStatView = () => {
      setMenuVisible(false);
      modal.showModal(AcademicProgressView, { fill: true, rect: true });
    };

    const gotoMain = () => {
      // store.commit("ui/showMenu");
      router.replace("/");
    };

    return {
      ctx,
      nav,
      route,
      loginUser, // 로그인 사용자(학생, 선생님)
      student, // 현재 시험을 보는 학생을 나타냄
      isStudent, // 로그인한 사람이 학생인지를 나타냄,
      policyPage, // 이용 약관 등 정보 페이지인지 나타냄
      topPadding,
      themeRef,
      section,
      mobileMenuVisible,
      gotoMain,
      changeCourse,
      openStatView,
      setMenuVisible,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";

.nav-bar {
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  width: 100%;
  z-index: 100;
  padding: 16px;
  background-color: var(--bg-color);
  transition: background-color 0.2s;
  // box-shadow: 0 2px 3px #0000004d;
  .btn-menu {
    display: flex;
    column-gap: 14px;
    align-items: center;
    &.left {
      cursor: pointer;
      height: 40px;
      flex: 0 0;
      background-image: url(/img/white_back_02.png);
      background-size: 196px 40px;
      background-repeat: no-repeat;
      background-position: left center;
      transition: flex-basis 0.2s cubic-bezier(0.22, 0.61, 0.36, 1);
    }
    &.mid {
      flex: 1 1 auto;
    }
    &.policy {
      height: 56px;
      display: flex;
      align-items: center;
      h3 {
        flex: 1 1 auto;
      }
    }
    .mobile {
      padding: 4px;
      display: inline-flex;
    }
  }
  .quiz-status {
    display: flex;
    align-items: center;
  }
  .lcs-combobox {
    position: fixed;
    top: 10px;
    z-index: 75;
    right: 56px;
  }
}
.mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  .inner {
    position: relative;
    display: flex;
    flex-direction: column;
    row-gap: 8px;
    padding: 20px;
    background-color: #fff;
    z-index: 1;
    > .app-btn {
      width: 100%;
    }
    .btn-close {
      display: flex;
      font-size: 16px;
      margin-left: auto;
    }
  }
}

@include mobile {
  .nav-bar {
    font-size: 1.5rem;
    column-gap: 8px;
    .btn-menu.mid > * {
      display: none;
    }
    .btn-menu.left {
      flex-basis: 196px;
    }
  }
  .quiz-status {
    height: calc(56px);
  }
}
@include tablet {
  .nav-bar {
    font-size: 2rem;
    column-gap: 8px;
    .btn-menu {
      &.left {
        flex-basis: 30px;
      }

      .mobile {
        display: none;
      }
    }

    .mobile-menu {
      display: none;
    }
  }
  .quiz-status {
    height: calc(56px);
  }
}
@include desktop {
  .nav-bar {
    font-size: 2rem;
    column-gap: 16px;
    .btn-menu.left {
      flex-basis: 196px;
    }
  }
  .quiz-status {
    height: calc(56px);
  }
}
</style>
