<template>
  <div class="menu-wrapper">
    <Transition name="dimmer">
      <div class="dimmer" v-if="slider" @click="hide"></div>
    </Transition>
    <Transition name="slider" @after-leave="store.commit('ui/hideMenu')">
      <div class="menu-body" v-if="slider">
        <MenuSection>
          <UserProfile />
        </MenuSection>
        <TeacherSectionMenu v-if="isTeacher" @statview="openStatView" />
        <StudentSectionMenu v-else @statview="openStatView" />
        <CompanyInfo :hideLogo="true" />
      </div>
    </Transition>
    <teleport to="body" v-if="modal">
      <Modal @hidden="hideModal" :fill="true" :rect="true">
        <AcademicProgressView @close="hideModal" />
      </Modal>
    </teleport>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed, ref, shallowRef } from "vue";
import MenuSection from "./MenuSection.vue";
import TeacherSectionMenu from "./TeacherSectionMenu.vue";
import StudentSectionMenu from "./StudentSectionMenu.vue";
import AcademicProgressView from "@/components/stats/AcademicProgressView.vue";
import UserProfile from "./UserProfile.vue";
import CompanyInfo from "../../components/company/CompanyInfo.vue";

export default {
  components: {
    AcademicProgressView,
    MenuSection,
    UserProfile,
    TeacherSectionMenu,
    StudentSectionMenu,
    CompanyInfo,
  },
  setup() {
    const store = useStore();
    const slider = ref(false);

    const modal = shallowRef(null);
    const isTeacher = computed(() => store.getters["user/isTeacher"]);
    const ctx = computed(() => store.state.quiz.quizContext);

    const hide = () => {
      slider.value = false;
    };
    setTimeout(() => {
      slider.value = true;
    }, 0);

    const openStatView = () => {
      modal.value = true;
    };
    const hideModal = () => {
      modal.value = null;
    };
    return {
      ctx,
      store,
      isTeacher,
      hide,
      slider,
      hideModal,
      modal,
      openStatView,
    };
  },
};
</script>

<style lang="scss" scoped>
.menu-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 200;
  height: 100%;
  .dimmer {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #7777774d;
  }
  .menu-body {
    height: 100%;
    width: 240px;
    background-color: white;
    position: relative;
    box-shadow: 2px 0 6px #0000004d;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }

  .dimmer-leave-to,
  .dimmer-enter-from {
    opacity: 0;
  }
  .dimmer-leave-active,
  .dimmer-enter-active {
    transition: opacity 0.15s ease-out;
  }

  .slider-enter-from {
    opacity: 0;
    transform: translateX(-100%);
  }
  .slider-enter-active {
    transition: transform 0.15s ease-out, opacity 0.15s ease-out;
  }

  .slider-leave-to {
    opacity: 0;
    transform: translateX(-100%);
  }
  .slider-leave-active {
    transition: transform 0.15s ease-out, opacity 0.15s ease-out;
  }
}
</style>
