<template>
  <div class="setting">
    <section class="left-menu">
      <SettingNav :menus="menus" />
    </section>
    <section class="viewport">
      <SettingJumbo />
      <div class="view">
        <router-view />
      </div>
    </section>
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
import SettingNav from "./SettingNav.vue";
import MenuItem from "./menu-item";
import settingStore from "./setting-store";
import SettingJumbo from "./SettingJumbo.vue";
export default {
  components: {
    SettingNav,
    SettingJumbo,
  },

  setup() {
    const store = useStore();
    const user = computed(() => store.getters["user/isMember"]);

    const menus = [
      new MenuItem("", "home", "마이페이지"),
      new MenuItem("account", "account_circle", "내 정보"),
      new MenuItem("license", "badge", "수강증"),
      // new MenuItem("orders", "monetization_on", "주문정보"),
      // new MenuItem("students", "people", "학생들"),
    ];
    store.registerModule("setting", settingStore);
    store.commit("setting/setMenus", menus);
    store.commit("ui/setNavSize", { expanded: false, topPadding: 0 });
    store.commit("ui/setBackgroundVisible", false);

    onMounted(() => {
      store.commit("setting/setActive", menus[0]);
    });
    onUnmounted(() => {
      store.unregisterModule("setting");
    });

    return { user, menus };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
$mwidth: 220px;
.setting {
  font-family: "NanumSquareRound", "Noto Sans KR", sans-serif;
  // font-weight: 700;
  display: flex;
  height: 100%;
  .left-menu {
    position: relative;
    flex: 0 0 $mwidth;
    width: $mwidth;
    background-color: azure;
  }
  .viewport {
    position: relative;
    flex: 1 1 auto;
    overflow-y: auto;
    .view {
      margin: 16px;
    }
  }
}
@include mobile {
  .setting {
    .left-menu {
      width: 44px;
      flex: 0 0 44px;
    }
  }
}
@include tablet {
}
@include desktop {
}
</style>
