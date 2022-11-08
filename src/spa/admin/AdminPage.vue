<template>
  <div class="admin-wrapper">
    <admin-menu :menus="menus" @menuClicked="openAdminBody" />
    <div class="admin-body">
      <!-- <level-analysis /> -->
      <component :is="activeBody" />
    </div>
  </div>
</template>

<script>
import { onMounted, shallowRef } from "@vue/runtime-core";
import { useStore } from "vuex";
import AdminMenu from "./views/AdminMenu.vue";
import LevelAnalysis from "./views/LevelAnalysis.vue";
import LicenseManage from "./views/LicenseManage.vue";
import OrderListView from "./views/order/OrderListView.vue";
import PolicyEditor from "./views/PolicyManage.vue";
import ProductManage from "./views/ProductManage.vue";

export default {
  components: {
    AdminMenu,
    OrderListView,
    ProductManage,
  },
  setup() {
    const store = useStore();
    const menus = [
      {
        id: "quiz",
        icon: "account_balance",
        title: "문제은행",
        comp: LevelAnalysis,
      },
      {
        id: "order",
        icon: "monetization_on",
        title: "주문내역",
        comp: OrderListView,
      },
      { id: "license", icon: "badge", title: "수강증", comp: LicenseManage },
      { id: "stats", icon: "insights", title: "통계", comp: null },
      { id: "policy", icon: "security", title: "이용약관", comp: PolicyEditor },
      {
        id: "product",
        icon: "storefront",
        title: "판매 상품",
        comp: ProductManage,
      },
    ];
    const activeBody = shallowRef(null);
    const openAdminBody = (menu) => {
      activeBody.value = menu.comp;
    };
    onMounted(() => {
      store.commit("ui/setNavSize", { expanded: false, topPadding: 0 });
    });
    return {
      menus,
      activeBody,
      openAdminBody,
    };
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
