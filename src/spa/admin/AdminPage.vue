<template>
  <div class="admin-wrapper">
    <div v-if="authCheck === 'LOADING'" class="loading"></div>
    <template v-else-if="authCheck === 'SUCCESS'">
      <admin-menu :menus="menus" @menuClicked="openAdminBody" />
      <div class="admin-body">
        <router-view />
      </div>
    </template>
    <div class="error" v-else>권한 없음</div>
  </div>
</template>

<script>
import { computed, ref, onMounted, shallowRef, watch } from "vue";
import { useStore } from "vuex";
import AdminMenu from "./views/AdminMenu.vue";
import LevelAnalysis from "./views/LevelAnalysis.vue";
import LicenseManage from "./views/LicenseManage.vue";
import OrderListView from "./views/order/OrderListView.vue";
import PolicyEditor from "./views/PolicyManage.vue";
import ProductManage from "./views/ProductManage.vue";
import GroupOrderView from "./views/order/GroupOrderView.vue";
import adminApi from "./service/admin-api";
import toast from "@/components/toast";
import { useRouter } from "vue-router";

export default {
  components: {
    AdminMenu,
  },
  setup() {
    const store = useStore();
    const user = computed(() => store.getters["user/currentUser"]);
    const authCheck = ref("LOADING");
    const router = useRouter();
    const menus = [
      {
        id: "quiz",
        icon: "account_balance",
        title: "문제은행",
        path: "/console/qbank",
        comp: LevelAnalysis,
      },
      {
        id: "order",
        icon: "monetization_on",
        title: "주문내역",
        path: "/console/order",
        comp: OrderListView,
      },
      {
        id: "license",
        icon: "badge",
        title: "수강증",
        path: "/console/licenses",
        comp: LicenseManage,
      },
      {
        id: "stats",
        icon: "insights",
        title: "통계",
        path: "/console/stats",
        comp: null,
      },
      {
        id: "policy",
        icon: "security",
        title: "이용약관",
        path: "/console/tos",
        comp: PolicyEditor,
      },
      {
        id: "product",
        icon: "storefront",
        title: "판매 상품",
        path: "/console/product",
        comp: ProductManage,
      },
      {
        id: "grouporder",
        icon: "forum",
        title: "단체 구매",
        path: "/console/grouporder",
        comp: GroupOrderView,
      },
    ];
    menus.forEach((menu) => {
      router.addRoute("AdminConsole", {
        path: menu.path,
        component: menu.comp,
        name: menu.id,
      });
    });
    const activeBody = shallowRef(null);
    const openAdminBody = (menu) => {
      activeBody.value = menu.comp;
      router.push(menu.path);
    };

    const checkAdmin = () => {
      if (!user.value) {
        return;
      }
      adminApi.admin
        .authenticate()
        .then(() => {
          authCheck.value = "SUCCESS";
        })
        .catch((err) => {
          toast.error("@" + err.cause, "권한 없음", 6);
          router.replace("/");
        });
    };

    watch(() => user.value, checkAdmin);
    onMounted(() => {
      store.commit("ui/setBackgroundVisible", false);
      store.dispatch("user/autoLogin").then((res) => {
        if (res === false) {
          toast.info("로그인 정보 없음", "로그인 필요", 5);
          router.replace("/");
        }
      });
    });
    return {
      user,
      authCheck,
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
