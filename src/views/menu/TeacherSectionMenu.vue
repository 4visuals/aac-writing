<template>
  <template v-if="quizState">
    <MenuSection title="진행상황"><QuizStateMenu /></MenuSection>
    <MenuSection title="종료"><QuizEndMenu /></MenuSection>
  </template>
  <template v-else>
    <MenuSection title="수강증">
      <LicenseMenu @clicked="showLicenseConfig" />
    </MenuSection>
    <MenuSection title="학생">
      <StudentMenu />
    </MenuSection>
  </template>
  <teleport to="body" v-if="modal.visible">
    <Modal @hidden="hideModal">
      <LicenseConfigView
        :license="modal.args"
        :licenses="licenses"
        :students="students"
      />
    </Modal>
  </teleport>
</template>

<script>
/**
 * 선생님용 메뉴
 */
import { ref } from "@vue/reactivity";
import MenuSection from "./MenuSection.vue";
import LicenseMenu from "./sections/LicenseMenu.vue";
import StudentMenu from "./sections/StudentMenu.vue";
import QuizStateMenu from "./sections/QuizStateMenu.vue";
import QuizEndMenu from "./sections/QuizEndMenu.vue";
import { LicenseConfigView } from "@/components/admin";
import { useRoute } from "vue-router";
import { computed } from "@vue/runtime-core";
import { useStore } from "vuex";
export default {
  components: {
    MenuSection,
    LicenseMenu,
    StudentMenu,
    QuizStateMenu,
    QuizEndMenu,
    LicenseConfigView,
  },
  setup() {
    const modal = ref({ visible: false, args: null });
    const store = useStore();
    const students = computed(() => store.getters["user/students"]);
    const licenses = computed(() => store.state.user.membership.licenses);
    const route = useRoute();
    const quizState = computed(() => route.path.startsWith("/quiz"));
    const showLicenseConfig = (license) => {
      modal.value.visible = true;
      modal.value.args = license;
    };
    const hideModal = () => {
      modal.value.visible = false;
      modal.value.args = null;
    };
    return {
      modal,
      quizState,
      students,
      licenses,
      showLicenseConfig,
      hideModal,
    };
  },
};
</script>

<style lang="scss" scoped></style>
