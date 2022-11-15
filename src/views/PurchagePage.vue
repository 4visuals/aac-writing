<template>
  <div class="purchase" @scroll="detectScroll">
    <TeacherNav :fixed="fixedMenu" @logout="doLogout" />
    <!-- <ProductBanner v-if="products" :products="products" /> -->
    <div class="jumbo" ref="bannerEl">
      <div class="container">
        <div class="row">
          <div class="col-xs-12">
            <div class="jumbo-body">
              <h3>이용권 구매</h3>
            </div>
          </div>
        </div>
      </div>
    </div>

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
import { computed, onMounted, onUnmounted, ref } from "vue";
import TeacherNav from "./nav/TeacherNav.vue";
import ProductView from "../components/product/ProductView.vue";
import api from "../service/api";
import toast from "../components/toast";

import { useStore } from "vuex";
import CompanyInfoDark from "../components/company/CompanyInfoDark.vue";

export default {
  components: {
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
    let timer = 0;
    const detectScroll = (e) => {
      const scroll = e.target.scrollTop;
      fixedMenu.value = scroll > 80;
    };
    const bgx = ["10%", "25%", "50%", "75%"];
    let pos = 1;
    const installBgSlider = () => {
      const el = bannerEl.value;

      timer = setInterval(() => {
        el.style.backgroundPositionX = bgx[pos];
        pos = (pos + 1) % bgx.length;
      }, 6000);
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

    store.commit("ui/setNavSize", { expanded: false, topPadding: 0 });

    onMounted(() => {
      installBgSlider();
    });
    onUnmounted(() => {
      clearInterval(timer);
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
  .jumbo {
    display: flex;
    align-items: flex-end;
    background-image: linear-gradient(
      45deg,
      #f7fee2,
      #fff5de,
      #c6f9ff,
      #d2e2ff,
      #a5a8fb,
      #a3f2ff,
      #fdffeb,
      #b0ddcf
    );
    background-size: 800% 100%;
    background-position: 0% 0%;
    background-repeat: no-repeat;
    transition: background-position 2s ease;
    .jumbo-body {
      text-align: center;
      margin-bottom: 6rem;
      h3 {
        font-family: "NanumSquareRound", "Noto Sans KR", sans-serif;
      }
    }
  }
  .banner {
    margin-top: 5rem;
    margin-bottom: 5rem;
  }
}
@include mobile {
  .purchase {
    .jumbo {
      height: 12rem;
      .jumbo-body {
        margin-bottom: 3rem;
      }
      h3 {
        font-size: 2rem;
        font-weight: 600;
      }
    }
    .banner {
      margin-top: 1rem;
      margin-bottom: 1rem;
    }
  }
}
@include tablet {
  .purchase {
    .jumbo {
      height: 20rem;

      h3 {
        font-size: 3rem;
        font-weight: 900;
      }
    }
  }
}
@include desktop {
  .purchase {
    .jumbo {
      height: 20rem;
      h3 {
        font-size: 3rem;
        font-weight: 900;
      }
    }
  }
}
</style>
