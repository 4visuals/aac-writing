<template>
  <div class="setting-nav">
    <div class="menu user-info" to="/">
      <AppIcon icon="person" fsize="20px" /><span class="text">{{
        user ? user.name : ""
      }}</span>
    </div>
    <SettingMenuItem
      v-for="item in menus"
      :key="item.seq"
      :menu="item"
      @click="settingNav.goTo(item)"
    />
  </div>
</template>

<script>
import { computed, inject } from "vue";
import { useStore } from "vuex";
import SettingMenuItem from "./SettingMenuItem.vue";

export default {
  components: {
    SettingMenuItem,
  },
  setup() {
    const store = useStore();
    const menus = computed(() => store.state.setting.menus);
    const user = computed(() => store.getters["user/isMember"]);
    const settingNav = inject("settingNav");
    return {
      user,
      menus,
      settingNav,
    };
  },
};
</script>

<style lang="scss" scoped>
.setting-nav {
  position: sticky;
  top: 90px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  font-weight: 700;

  border-radius: 16px;
  border: 2px solid #d2dde3;
  flex: 0 0 220px;
  width: 100%;
  background-color: #f8f8f8;
  overflow: hidden;

  .user-info {
    text-decoration: none;
    display: flex;
    column-gap: 16px;
    align-items: center;
    height: 60px;
    font-size: 20px;
    padding: 12px 16px;
    background-color: white;
  }
}
@media (max-width: 767px) {
  .setting-nav {
    .user-info {
      padding: 12px;
      .text {
        display: none;
      }
    }
  }
}
</style>
