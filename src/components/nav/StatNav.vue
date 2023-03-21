<template>
  <div
    v-if="nav.visible"
    class="nav-bar"
    :style="`--bg-color: ${themeRef.bgc}`"
  >
    <div class="btn-menu left" @click="$emit('exit')">
      <AppIcon icon="arrow_left" fsize="2.5rem" />
      <SpanText>나가기</SpanText>
    </div>
    <div class="btn-menu mid">
      <AppButton
        size="nav"
        text="오늘"
        :theme="themeRef.name"
        :fill="true"
        :invert="menu === 'today'"
        @click="$emit('page', 'today')"
      ></AppButton>
      <AppButton
        size="nav"
        text="단계별"
        :theme="themeRef.name"
        :fill="true"
        :invert="menu === 'level'"
        @click="$emit('page', 'level')"
      /><AppButton
        size="nav"
        text="교과서"
        :theme="themeRef.name"
        :fill="true"
        :invert="menu === 'book'"
        @click="$emit('page', 'book')"
      />
    </div>
    <div class="btn-menu right">
      <button class="nude mobile" @click="mobileMenuVisible = true">
        <AppIcon class="folding-menu" icon="menu" fsize="24px" />
      </button>
      <!-- <StudentLogo v-if="!policyPage" :student="student" size="lg" /> -->
    </div>
    <div v-if="mobileMenuVisible" class="mobile-menu">
      <div class="modal-dimmer"></div>
      <div class="inner">
        <AppButton
          size="nav"
          text="오늘"
          :theme="themeRef.name"
          :fill="true"
          :invert="menu === 'today'"
          @click="$emit('page', 'today')"
        ></AppButton>
        <AppButton
          size="nav"
          text="단계별"
          :theme="themeRef.name"
          :fill="true"
          :invert="menu === 'level'"
          @click="$emit('page', 'level')"
        /><AppButton
          size="nav"
          text="교과서"
          :theme="themeRef.name"
          :fill="true"
          :invert="menu === 'book'"
          @click="$emit('page', 'book')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed, ref } from "@vue/runtime-core";
import { useRoute } from "vue-router";
import { SpanText } from "../text";

export default {
  props: {
    menu: {
      type: String,
      default: "today",
    },
  },
  setup() {
    const store = useStore();
    const nav = computed(() => store.getters["ui/nav"]);
    const route = useRoute();

    const loginUser = computed(() => store.getters["user/currentUser"]);
    const ctx = computed(() => store.state.quiz.quizContext);
    const topPadding = computed(() => store.getters["ui/topPadding"]);
    const policyPage = computed(() => route.path.startsWith("/policy"));
    const student = computed(() => store.getters["exam/student"]);
    const themeRef = computed(() => store.state.ui.theme);
    const mobileMenuVisible = ref(false);

    store.commit("ui/setTheme", ["stat"]);
    return {
      ctx,
      nav,
      route,
      loginUser,
      student,
      policyPage,
      topPadding,
      themeRef,
      mobileMenuVisible,
    };
  },
  components: { SpanText },
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
      font-weight: 600;
      font-size: 2rem;
      white-space: nowrap;
      flex: 0 0 auto;
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
    .btn-menu {
      .mobile {
        display: none;
      }
    }
  }
  .quiz-status {
    height: calc(56px);
  }
}
</style>
