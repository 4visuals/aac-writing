<template>
  <div class="setting-nav">
    <router-link class="menu back" to="/"
      ><AppIcon icon="arrow_back" /><span class="text"
        >나가기</span
      ></router-link
    >
    <SettingMenuItem
      v-for="item in menus"
      :key="item.seq"
      :menu="item"
      @click="menuClicked(item)"
    />
  </div>
</template>

<script>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import SettingMenuItem from "./SettingMenuItem.vue";

export default {
  // props: ["menus"],
  components: {
    SettingMenuItem,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const menus = computed(() => store.state.setting.menus);
    const menuClicked = (menu) => {
      store.commit("setting/setActive", menu);
      router.replace(menu.getFullPath());
    };
    return {
      menus,
      menuClicked,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
.setting-nav {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  font-weight: 700;
  // .menu {
  //   padding: 12px 16px;
  //   font-size: 20px;
  // }
  a.back {
    text-decoration: none;
    display: flex;
    column-gap: 16px;
    align-items: center;
    height: 60px;
    font-size: 20px;
    padding: 12px 16px;
  }
}
@include mobile {
  .setting-nav {
    a.back {
      .text {
        display: none;
      }
    }
  }
}
</style>
