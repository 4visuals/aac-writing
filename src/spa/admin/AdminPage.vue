<template>
  <div class="admin-wrapper">
    <admin-menu />
    <div class="admin-body">
      <level-analysis />
    </div>
  </div>
</template>

<script>
import { onMounted } from "@vue/runtime-core";
import { useStore } from "vuex";
import AdminMenu from "./views/AdminMenu.vue";
import LevelAnalysis from "./views/LevelAnalysis.vue";
export default {
  components: {
    AdminMenu,
    LevelAnalysis,
  },
  setup() {
    const store = useStore();
    onMounted(() => {
      store.commit("ui/setNavSize", { expanded: false, topPadding: 0 });
    });
  },
};
</script>

<style lang="scss" scoped>
.admin-wrapper {
  height: 100%;
  display: flex;
  .admin-body {
    flex: 1 1 auto;
  }
}
</style>
