<template>
  <div class="menu-wrapper">
    <div class="menu-body">
      <h3>관리자 메뉴</h3>
      <div class="secion">
        <button class="exit">나가기</button>
      </div>
      <div
        class="section"
        v-for="menu in menus"
        :key="menu.id"
        @click="$emit('menuClicked', menu)"
      >
        <div class="section-body">
          <span class="icon material-icons-outlined">{{ menu.icon }}</span>
          <span class="desc">{{ menu.title }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { shallowRef } from "@vue/reactivity";

export default {
  props: ["menus"],
  setup() {
    const bodyComponent = shallowRef(null);
    const showAdminBody = (menu) => {
      bodyComponent.value = menu.comp;
    };
    return {
      showAdminBody,
    };
  },
};
</script>

<style lang="scss" scoped>
.menu-wrapper {
  flex: 0 0 140px;
  .menu-body {
    .section {
      padding: 0.75rem 1rem;
      user-select: none;
      cursor: pointer;
      .section-body {
        display: flex;
        column-gap: 8px;
        align-items: center;
        .icon {
          font-size: 18px;
        }
        .desc {
          font-size: 14px;
        }
      }
    }
  }
}
</style>
