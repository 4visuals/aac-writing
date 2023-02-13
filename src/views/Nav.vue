<template>
  <div class="nav-bar" :style="`--bg-color: ${themeRef.bgc}`">
    <div class="btn-menu left" @click="openMenu">
      <img alt="" src="/img/white_back_02.png" width="259" height="53" />
    </div>
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
    </div>
    <div class="btn-menu right">
      <AppButton text="평가보기" theme="none"></AppButton>
      <StudentLogo v-if="!policyPage" :student="student" size="lg" />
    </div>
    <!-- <div class="btn-menu center policy" v-if="policyPage">
      <h3>그림한글 이용 약관</h3>
    </div> -->
  </div>
</template>

<script>
import StudentLogo from "@/components/StudentLogo.vue";
import { useStore } from "vuex";
import { computed, ref, watch } from "@vue/runtime-core";
import { useRoute, useRouter } from "vue-router";
// import { reactive } from "vue";
// const modeText = {
//   READING: "읽기",
//   LEARNING: "학습",
//   QUIZ: "퀴즈",
// };
// const rssText = {
//   W: "낱말",
//   S: "문장",
//   A: "교과서",
// };
export default {
  components: {
    // ActionIcon,
    StudentLogo,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const loginUser = computed(() => store.getters["user/currentUser"]);
    const membership = computed(() => store.state.user.membership);
    const isStudent = computed(() => store.getters["user/isStudent"]);
    const ctx = computed(() => store.state.quiz.quizContext);
    // const boxVisible = ref(false);
    const topPadding = computed(() => store.getters["ui/topPadding"]);
    const quizPage = computed(() => store.getters["quiz/quizPage"]);
    const policyPage = computed(() => route.path.startsWith("/policy"));
    const student = computed(() => store.getters["exam/student"]);
    // const sectionSpec = reactive({
    //   path: "",
    //   theme: "",
    //   idx: 0,
    //   type: null,
    //   mode: null,
    // });
    const themeRef = computed(() => store.state.ui.theme);
    const section = ref(null);

    // const themes = {
    //   level: "blue",
    //   book: "yellow",
    // };
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

    const changeCourse = (idx) => {
      router.replace(courses[idx].path);
    };

    watch(
      route.path,
      () => {
        // const path = route.path.substring(1);
        // sectionSpec.theme = themes[path];
        // sectionSpec.path = path;
      },
      { immediate: true }
    );
    /*
    watch(
      () => ctx.value,
      (ctx) => {
        if (ctx) {
          const sec = ctx.section;
          section.value = sec;
          let theme = "";
          if (sec.level === -1) {
            theme = "green";
          } else if (ctx.resourceType === "A") {
            theme = "yellow";
          } else {
            theme = "pink";
          }
          sectionSpec.value.theme = theme;
          sectionSpec.value.idx = sec.level < 0 ? "T" : sec.level;
          sectionSpec.value.type =
            ctx.mode === "READING" ? "보고" : rssText[ctx.resourceType];
          sectionSpec.value.mode =
            ctx.mode === "READING" ? "쓰기" : modeText[ctx.mode];
        } else {
          sectionSpec.value.mode = "";
        }
      }
    );
    */

    const openMenu = () => {
      // console.log("[back]", router);
      // router.back();
      store.commit("ui/showMenu");
    };

    return {
      ctx,
      route,
      loginUser, // 로그인 사용자(학생, 선생님)
      student, // 현재 시험을 보는 학생을 나타냄
      isStudent, // 로그인한 사람이 학생인지를 나타냄,
      policyPage, // 이용 약관 등 정보 페이지인지 나타냄
      topPadding,
      themeRef,
      section,
      quizPage,
      openMenu,
      membership,
      changeCourse,
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
  padding: 20px;
  background-color: var(--bg-color);
  transition: background-color 0.2s;
  // box-shadow: 0 2px 3px #0000004d;
  .btn-menu {
    display: flex;
    column-gap: 14px;
    align-items: center;
    &.left {
      cursor: pointer;
    }
    &.right {
      right: 16px;
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
@include mobile {
  .nav-bar {
    font-size: 1.5rem;
    column-gap: 8px;
  }
  .quiz-status {
    height: calc(56px);
  }
}
@include tablet {
  .nav-bar {
    font-size: 2rem;
    column-gap: 16px;
  }
  .quiz-status {
    height: calc(56px);
  }
}
@include desktop {
  .nav-bar {
    font-size: 2rem;
    column-gap: 16px;
  }
  .quiz-status {
    height: calc(56px);
  }
}
</style>
