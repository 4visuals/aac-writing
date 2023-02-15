<template>
  <div class="pwrapper" @scroll="detectScroll">
    <TeacherNav :fixed="fixedMenu" />
    <div class="pol-head max800">
      <div class="policies">
        <div
          v-for="btn in buttons"
          :key="btn.path"
          class="pol"
          :class="{ active: activeBtn.path === btn.path }"
          @click="moveTo(btn)"
        >
          {{ btn.text }}
        </div>
      </div>
    </div>
    <div class="container-fluid max800">
      <div class="row">
        <div class="col-12">
          <router-view v-if="policy" :mdText="policy.detail" />
          <div v-else class="loading">...</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TeacherNav from "../../views/nav/TeacherNav.vue";
import { ref, watch } from "vue";
import { useStore } from "vuex";
import api from "@/service/api";
import { useRoute, useRouter } from "vue-router";

export default {
  components: {
    TeacherNav,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const buttons = [
      {
        path: "/",
        type: "PV",
        text: "돌아가기",
      },
      {
        path: "/policy/tou",
        type: "TM",
        text: "서비스 이용 약관",
      },
      {
        path: "/policy/privacy",
        type: "PV",
        text: "개인정보 처리 방침",
      },
    ];
    const activeBtn = ref(null);
    const policy = ref(null);
    const fixedMenu = ref(false);
    let policies = null;
    const pathMap = {
      tou: "TM",
      privacy: "PV",
    };
    api.policy.load().then((res) => {
      policies = res;
      const subpath = route.path.split("/")[2];
      policy.value = policies[pathMap[subpath || "TM"]];
    });
    const moveTo = ({ path, type }) => {
      policy.value = policies[type];
      router.replace(path);
    };
    const detectScroll = (e) => {
      const scroll = e.target.scrollTop;
      fixedMenu.value = scroll > 180;
    };
    watch(
      () => route.path,
      (path) => {
        const btn = buttons.find((btn) => btn.path === path);
        activeBtn.value = btn;
        store.commit("ui/hideMenu");
      },
      {
        immediate: true,
      }
    );

    return {
      buttons,
      activeBtn,
      policy,
      fixedMenu,
      moveTo,
      detectScroll,
    };
  },
};
</script>

<style lang="scss" scoped>
$bgcolor: #fffdf4;
.pwrapper {
  height: 100%;
  overflow-y: auto;
  position: relative;
  .pol-head {
    position: sticky;
    top: 56px;
    margin: 0 auto;
    .policies {
      display: flex;
      align-items: center;
      margin: 1px;
      background-color: $bgcolor;
      .pol {
        flex: 1 1 auto;
        font-size: 1.25rem;
        padding: 8px;
        border: 1px solid #ccc;
        margin: -1px 0 0 -1px;
        cursor: pointer;
        &.active {
          background-color: #416dea;
          color: white;
          border-color: #416dea;
        }
      }
    }
  }
  .container-fluid {
    margin-top: 56px;
  }
}
</style>
