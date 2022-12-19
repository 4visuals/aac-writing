<template>
  <div class="menu-wrapper">
    <div class="menu-body">
      <h3>관리자 메뉴</h3>
      <div class="secion">
        <button class="exit" @click="exitPage">나가기</button>
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

<script setup>
import { defineProps } from "vue";
import { useRouter } from "vue-router";
defineProps(["menus"]);
const router = useRouter();
const exitPage = () => {
  router.replace("/");
};
</script>

<style lang="scss" scoped>
.menu-wrapper {
  flex: 0 0 140px;
  .menu-body {
    position: fixed;
    top: 0;
    width: 140px;
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
