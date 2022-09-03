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
  <teleport to="body" v-if="modal.visible">
    <Modal @hidden="hideModal" :fill="true" :rect="true">
      <ModalHeader
        ><ActionIcon
          icon="arrow_back"
          @click="modal.visible = false"
        ></ActionIcon
        ><SpanText>학습 결과</SpanText></ModalHeader
      >
      <DailyStatView />
    </Modal>
  </teleport>
</template>

<script>
/**
 * 선생님용 메뉴
 */
import { ActionIcon } from "../../components/form";
import { SpanText } from "@/components/text";
import { ref } from "@vue/reactivity";
import MenuSection from "./MenuSection.vue";
import LicenseMenu from "./sections/LicenseMenu.vue";
// import StudentMenu from "./sections/StudentMenu.vue";
import QuizSegmentMenu from "./sections/QuizSegmentMenu.vue";
import QuizEndMenu from "./sections/QuizEndMenu.vue";
// import { LicenseConfigView } from "@/components/admin";
import { useRoute } from "vue-router";
import { computed } from "@vue/runtime-core";
import { useStore } from "vuex";
import DailyStatView from "../../components/stats/DailyStatView.vue";
export default {
  components: {
    ActionIcon,
    MenuSection,
    LicenseMenu,
    // StudentMenu,
    DailyStatView,
    QuizSegmentMenu,
    QuizEndMenu,
    // LicenseConfigView,
    SpanText,
  },
  setup() {
    const ctx = computed(() => store.state.quiz.quizContext);
    const modal = ref({ visible: false, args: null });
    const store = useStore();
    const students = computed(() => store.getters["user/students"]);
    const licenses = computed(() => store.state.user.membership.licenses);
    const route = useRoute();
    const quizState = computed(() => route.path.startsWith("/quiz"));
    const showDailyStatView = (license) => {
      modal.value.visible = true;
      modal.value.args = license;
    };
    const hideModal = () => {
      modal.value.visible = false;
      modal.value.args = null;
    };
    return {
      ctx,
      modal,
      quizState,
      students,
      licenses,
      showDailyStatView,
      hideModal,
    };
  },
};
</script>

<style lang="scss" scoped>
.pad {
  flex: 1 1 auto;
}
</style>
