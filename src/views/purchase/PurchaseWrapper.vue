<template>
  <div class="purchase" @scroll="detectScroll">
    <UserGnb />
    <Jumbotron title="이용권 구매" />
    <router-view />
    <CompanyInfoDark />
  </div>
</template>

<script>
import Jumbotron from "../../components/Jumbotron.vue";
import { computed, onUnmounted, ref } from "vue";
import UserGnb from "../nav/UserGnb.vue";
import toast from "../../components/toast";

import { useStore } from "vuex";
import CompanyInfoDark from "../../components/company/CompanyInfoDark.vue";

export default {
  components: {
    Jumbotron,
    UserGnb,
    CompanyInfoDark,
  },
  setup() {
    const store = useStore();
    const loginUser = computed(() => store.getters["user/currentUser"]);
    const fixedMenu = ref(false);
    const detectScroll = (e) => {
      const scroll = e.target.scrollTop;
      fixedMenu.value = scroll > 80;
    };

    const createOrderByIMPORT = (event) => {
      const { method, product } = event;
      const imp = window.IMP;
      imp.init("imp20450844");
      console.log(product);
      // imp20450844
      const merchant_uid =
        Math.random().toString(36).substring(2) +
        Math.random().toString(36).substring(2);
      imp.request_pay(
        {
          // param
          pg: "danal_tpay.9810030929",
          pay_method: method,
          merchant_uid,
          name: product.name,
          amount: product.price,
          buyer_email: loginUser.value.email,
          buyer_name: loginUser.value.name,
        },
        (res) => {
          // callback
          if (res.success) {
            console.log("[SUCCESS]", JSON.stringify(res));
            toast.success(
              `구매하신 상품이 결제되었습니다.(${product.price})`,
              product.name,
              10
            );
            // 결제 성공 시 로직,
          } else {
            console.log("[FAILURE]", res);
            toast.warn("결제를 취소했습니다", "결제 취소", 5);
          }
        }
      );
    };

    store.commit("ui/setBackgroundVisible", false);

    onUnmounted(() => {
      store.commit("ui/setBackgroundVisible", true);
    });
    return {
      // products,
      // themes,
      fixedMenu,
      loginUser,
      detectScroll,
      createOrderByIMPORT,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
.purchase {
  height: 100%;
  overflow-y: auto;
  .banner {
    margin-top: 5rem;
    margin-bottom: 5rem;
  }
}
@include mobile {
  .purchase {
    .banner {
      margin-top: 1rem;
      margin-bottom: 1rem;
    }
  }
}
</style>
