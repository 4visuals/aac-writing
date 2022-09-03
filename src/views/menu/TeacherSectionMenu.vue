<template>
  <template v-if="quizState">
    <MenuSection :title="ctx.section.chapter.desc"
      ><QuizSegmentMenu></QuizSegmentMenu
    ></MenuSection>
    <MenuSection title=""><QuizEndMenu /></MenuSection>
  </template>
  <template v-else>
    <MenuSection>
      <LicenseMenu @clicked="showDailyStatView" />
    </MenuSection>
  </template>
</template>

<script>
/**
 * 선생님용 메뉴
 */
import MenuSection from "./MenuSection.vue";
import LicenseMenu from "./sections/LicenseMenu.vue";
import QuizSegmentMenu from "./sections/QuizSegmentMenu.vue";
import QuizEndMenu from "./sections/QuizEndMenu.vue";
import { useRoute } from "vue-router";
import { computed } from "@vue/runtime-core";
import { useStore } from "vuex";
export default {
  components: {
    MenuSection,
    LicenseMenu,
    QuizSegmentMenu,
    QuizEndMenu,
  },
  setup(_, { emit }) {
    const ctx = computed(() => store.state.quiz.quizContext);
    const store = useStore();
    const students = computed(() => store.getters["user/students"]);
    const licenses = computed(() => store.state.user.membership.licenses);
    const route = useRoute();
    const quizState = computed(() => route.path.startsWith("/quiz"));
    const showDailyStatView = (license) => {
      emit("statview", license);
    };
    return {
      ctx,
      quizState,
      students,
      licenses,
      showDailyStatView,
    };
  },
};
</script>

<style lang="scss" scoped>
.pad {
  flex: 1 1 auto;
}
</style>
