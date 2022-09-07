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
      </div>
    </Transition>
    <teleport to="body" v-if="modal">
      <Modal @hidden="hideModal" :fill="true" :rect="true">
        <ModalHeader
          ><ActionIcon icon="arrow_back" @click="hideModal"></ActionIcon
          ><SpanText>학습 결과</SpanText>
          <div class="ctrls">
            <button
              :class="{
                active: menu === activeMenu,
                daily: menu.daily,
                level: menu.level,
                book: menu.book,
              }"
              v-for="menu in menus"
              :key="menu.cmd"
              @click="switchView(menu)"
            >
              {{ menu.text }}
            </button>
          </div></ModalHeader
        >
        <component :is="modal.comp" v-bind="{ ...modal.args }" />
      </Modal>
    </teleport>
  </div>
</template>

<script>
import { ActionIcon } from "../../components/form";
import { SpanText } from "@/components/text";
import { useStore } from "vuex";
import { computed, ref, shallowRef } from "vue";
import MenuSection from "./MenuSection.vue";
import TeacherSectionMenu from "./TeacherSectionMenu.vue";
import StudentSectionMenu from "./StudentSectionMenu.vue";
import DailyStatView from "../../components/stats/DailyStatView.vue";
import CourseStatView from "../../components/stats/CourseStatView.vue";
import BookStatView from "../../components/stats/BookStatView.vue";
import Flag from "@/components/Flag.vue";
// import OAuthButton2 from "@/components/oauth/OAuthButton2.vue";
import UserProfile from "./UserProfile.vue";
export default {
  components: {
    ActionIcon,
    Flag,
    MenuSection,
    UserProfile,
    SpanText,
    TeacherSectionMenu,
    StudentSectionMenu,
    DailyStatView,
    CourseStatView,
    BookStatView,
  },
  setup() {
    const store = useStore();
    const slider = ref(false);
    const modal = shallowRef(null);
    const activeMenu = shallowRef(null);
    const isTeacher = computed(() => store.getters["user/isTeacher"]);
    const ctx = computed(() => store.state.quiz.quizContext);
    const menus = [
      { text: "오늘", cmd: "daily", comp: DailyStatView, daily: true },
      {
        text: "단계별",
        cmd: "level",
        comp: CourseStatView,
        level: true,
        args: { origin: "L" },
      },
      {
        text: "교과서",
        cmd: "book",
        comp: CourseStatView,
        book: true,
        args: { origin: "B" },
      },
    ];
    // const loginButton = shallowRef(null);
    const hide = () => {
      // store.commit("ui/hideMenu");
      slider.value = false;
    };
    setTimeout(() => {
      slider.value = true;
    }, 0);

    const openStatView = () => {
      switchView(menus[0]);
    };
    const hideModal = () => {
      modal.value = null;
    };
    const switchView = (menu) => {
      activeMenu.value = menu;
      modal.value = { comp: menu.comp, args: menu.args };
    };
    return {
      ctx,
      store,
      menus,
      activeMenu,
      isTeacher,
      hide,
      slider,
      hideModal,
      modal,
      openStatView,
      switchView,
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
.ctrls {
  position: absolute;
  right: 6px;
  top: 0;
  font-size: 1rem;
  display: flex;
  column-gap: 6px;
  button {
    border: none;
    outline: none;
    padding: 4px 6px;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    height: 28px;
    &.active {
      color: white;
      font-weight: 500;
      height: 32px;
      font-size: 1.25rem;
      &.daily {
        background-color: crimson;
      }
      &.level {
        color: var(--aac-color-pink-900);
        background-color: var(--aac-color-pink-400);
      }
      &.book {
        color: var(--aac-color-yellow-900);
        background-color: var(--aac-color-yellow-400);
      }
    }
  }
}
</style>
