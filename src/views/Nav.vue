<template>
  <div class="red nav-bar">
    <ActionIcon class="btn-menu left" icon="menu" @click="openMenu" />
    <div class="btn-menu center quiz-status" v-if="ctx">
      <SectionButton
        :item="section"
        :idx="sectionSpec.idx"
        :theme="sectionSpec.theme"
        :desc="`${sectionSpec.type}${sectionSpec.mode}`"
        compact
      />
    </div>
    <StudentLogo :student="student" class="btn-menu right s32" v-if="ctx" />
    <Logo
      v-else
      class="btn-menu right"
      :imagePath="membership && membership.image"
      :vendor="membership ? membership.vendor : 'guest'"
      size="xs"
      @click="showLicenseBox"
    />
    <div class="lcs-combobox" v-if="boxVisible" @click="hideLincenseBox">
      <div class="lcs">감자군</div>
      <div class="lcs">양파군</div>
    </div>
  </div>
</template>

<script>
import Logo from "@/components/oauth/Logo.vue";
import StudentLogo from "@/components/StudentLogo.vue";
import { useStore } from "vuex";
import { ActionIcon } from "@/components/form";
import { computed, ref, watch } from "@vue/runtime-core";
import SectionButton from "@/components/SectionButton.vue";
// import router from "@/router";
const modeText = {
  READING: "읽기",
  LEARNING: "쓰기",
  QUIZ: "퀴즈",
};
const rssText = {
  W: "낱말",
  S: "문장",
  A: "교과서",
};
export default {
  components: {
    ActionIcon,
    Logo,
    StudentLogo,
    SectionButton,
  },
  setup() {
    const store = useStore();
    const membership = computed(() => store.state.user.membership);
    const ctx = computed(() => store.state.quiz.quizContext);
    const boxVisible = ref(false);
    const topPadding = computed(() => store.getters["ui/topPadding"]);
    const quizPage = computed(() => store.getters["quiz/quizPage"]);
    const student = computed(() => store.getters["exam/student"]);
    const sectionSpec = ref({ theme: "", idx: 0, type: null, mode: null });
    const section = ref(null);
    // if (ctx) {
    //   sectionSpec.value.mode = ctx.isWord() ? "낱말" : "문장";
    // }
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
          sectionSpec.value.type = rssText[ctx.resourceType];
          sectionSpec.value.mode = modeText[ctx.mode];
        } else {
          sectionSpec.value.mode = "";
        }
      }
    );

    const openMenu = () => {
      // console.log("[back]", router);
      // router.back();
      store.commit("ui/showMenu");
    };
    const showLicenseBox = () => {
      boxVisible.value = true;
    };
    const hideLincenseBox = () => {
      boxVisible.value = false;
    };
    return {
      ctx,
      student,
      boxVisible,
      topPadding,
      sectionSpec,
      section,
      quizPage,
      openMenu,
      membership,
      showLicenseBox,
      hideLincenseBox,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";

.nav-bar {
  display: flex;
  align-items: center;
  width: 100%;
  z-index: 100;
  // box-shadow: 0 2px 3px #0000004d;
  .btn-menu {
    position: fixed;
    top: 16px;
    z-index: 75;
    &.left {
      left: 16px;
    }
    &.right {
      right: 16px;
      &.s32 {
        top: 11px;
        right: 12px;
      }
    }
    &.center {
      top: 0;
      left: 56px;
      right: 56px;
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
