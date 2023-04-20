<template>
  <div class="user-profile">
    <div
      v-if="membership"
      class="blocked chip rounded border"
      @click="resolveClick"
    >
      <StudentLogo
        :student="membership.user"
        size="sm"
        class="btn-menu right s32"
        v-if="isStudent"
      />
      <Logo
        v-else
        class="logo"
        :imagePath="
          membership
            ? membership.image
            : require('@/assets/logo/logo_google.svg')
        "
        size="xs"
      />
      <div class="text row-2" v-if="membership">
        <div class="name">{{ membership.profile.name }}님</div>
        <div class="email">{{ membership.profile.email }}</div>
      </div>
      <div class="text" v-else>{{ loginText || "Google 계정으로 로그인" }}</div>
      <ActionIcon class="setting" v-if="membership" icon="settings" />
    </div>
    <div class="option" v-if="membership">
      <a
        v-if="isTeacher"
        class="blue anchor"
        :class="{ even: isTeacher }"
        href="#"
        @click.prevent.stop="changeStudent"
        ><span class="icon material-icons-outlined">face</span
        ><span class="text">학생전환</span></a
      >
      <a
        class="red anchor"
        :class="{ even: isTeacher }"
        href="#"
        @click.prevent.stop="doLogout"
        ><span class="icon material-icons-outlined">logout</span
        ><span class="text">로그아웃</span></a
      >
    </div>
  </div>
</template>

<script>
import Logo from "@/components/oauth/Logo.vue";
import StudentLogo from "@/components/StudentLogo.vue";
import DialogView from "@/components/dialog/DialogView.vue";
import modal from "../../components/modal";
import { ActionIcon } from "@/components/form";
import { useStore } from "vuex";
import { computed, ref } from "@vue/runtime-core";
import { useRouter } from "vue-router";
export default {
  props: ["loginText"],
  components: {
    Logo,
    StudentLogo,
    ActionIcon,
  },
  setup() {
    const store = useStore();
    const isStudent = computed(() => store.getters["user/isStudent"]);
    const isTeacher = computed(() => store.getters["user/isTeacher"]);
    const membership = computed(() => store.state.user.membership);
    const router = useRouter();
    const googleRef = ref(null);

    const resolveClick = () => {
      if (membership.value && isTeacher.value) {
        store.commit("ui/hideMenu");
        router.push("/setting");
      }
    };
    const changeStudent = () => {
      router.replace("/");
    };
    const handleLogout = (cmd) => {
      if (cmd === "yes") {
        store.commit("user/logoutUser");
        router.replace("/");
      }
      modal.closeModal();
    };
    const goSettings = () => {
      console.log("ddd");
    };
    const doLogout = () => {
      store.commit("ui/hideMenu");
      modal.showModal(DialogView, {
        width: "sm",
        props: {
          title: "로그아웃",
          message: "오늘의 수업을 끝냅니까?",
          actions: [
            { cmd: "yes", text: "수업을 끝냅니다" },
            { cmd: "no", text: "아니오" },
          ],
        },
        events: { commit: handleLogout },
      });
      if (isStudent.value) {
        console.log("학생");
      } else {
        console.log("교사");
      }
    };

    return {
      isStudent,
      isTeacher,
      membership,
      googleRef,
      resolveClick,
      changeStudent,
      doLogout,
      goSettings,
    };
  },
};
</script>

<style lang="scss" scoped>
.user-profile {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  width: 100%;
  background-color: white;
  .option {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 8px 0 0;
    column-gap: 8px;
    .even {
      flex: 1 1 50%;
    }
    .anchor {
      display: inline-flex;
      align-items: center;
      text-decoration: none;
      border-radius: 32px;
      padding: 6px 12px;
      column-gap: 6px;
      .icon {
        font-size: 16px;
      }
      .text {
        font-size: 12px;
      }

      &.blue {
        color: aliceblue;
        background-color: #416dea;
      }
      &.red {
        color: white;
        background-color: #f32c52;
      }
    }
  }
  .detail {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
  }
  .chip {
    position: relative;
    display: flex;
    align-items: center;
    padding: 6px 12px;
    cursor: pointer;
    &.blocked {
      width: 100%;
    }
    &.rounded {
      border-radius: 4px;
    }
    &.border {
      border: 1px solid #ccc;
    }
    &:hover {
      border-color: #d2e3fc;
      background-color: rgba(66, 133, 244, 0.04);
    }
    .text {
      margin: 0 12px;
      font-size: 1rem;
      flex: 1 1 auto;
      overflow: hidden;
      & > div {
        overflow-x: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .name {
        font-weight: 500;
        color: #3c4043;
      }
      .email {
        color: #5f6368;
        font-size: 0.85rem;
      }
    }
    .setting {
      color: #636363;
      font-size: 20px;
    }
  }
}
</style>
