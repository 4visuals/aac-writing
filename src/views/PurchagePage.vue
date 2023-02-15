<template>
  <div class="purchase" @scroll="detectScroll">
    <TeacherNav :fixed="fixedMenu" @logout="doLogout" />
    <Jumbotron title="이용권 구매" />

    <div class="banner container">
      <div class="row">
        <ProductView
          v-for="(prod, index) in products"
          :key="prod.code"
          :product="prod"
          :theme="themes[index]"
          @order="createOrderByIMPORT"
          class="col-xs-12 col-sm-6 col-md-6 col-lg-6"
        />
      </div>
    </div>
    <CompanyInfoDark />
  </div>
</template>

<script>
import { computed, ref } from "vue";
import TeacherNav from "./nav/TeacherNav.vue";
import ProductView from "../components/product/ProductView.vue";
import Jumbotron from "../components/Jumbotron.vue";
import api from "../service/api";
import toast from "../components/toast";

import { useStore } from "vuex";
import CompanyInfoDark from "../components/company/CompanyInfoDark.vue";

export default {
  components: {
    Jumbotron,
    TeacherNav,
    ProductView,
    CompanyInfoDark,
  },
  setup() {
    const store = useStore();
    const products = ref(null);
    const themes = ["red", "blue", "green", "red", "blue", "green"];
    const loginUser = computed(() => store.getters["user/currentUser"]);
    const fixedMenu = ref(false);
    const bannerEl = ref(null);
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

    api.product.list().then((res) => {
      products.value = res.products;
    });

    return {
      bannerEl,
      products,
      themes,
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
