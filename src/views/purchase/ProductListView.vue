<template>
  <div class="prod-list container">
    <PurchaseJumbo />
    <div class="row">
      <div class="col-xs-12">
        <ProductTabNav :tabs="productTabs" />
      </div>
    </div>
    <div v-if="activeTab.cmd === 'license'" class="row">
      <div
        v-for="prod in products"
        :key="prod.code"
        class="col-xs-12 col-sm-12 col-md-6 col-lg-6"
      >
        <ProductView :product="prod" @order="gotoOrderForm" class="product" />
      </div>
    </div>
    <div v-else-if="activeTab.cmd === 'book'" class="row">
      <div class="col-xs-12">
        <h3>교재 구매 페이지로</h3>
      </div>
    </div>
    <div v-else-if="activeTab.cmd === 'groupOrder'" class="row">
      <div class="col-xs-12">
        <h3>단체구매 양식</h3>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from "vue";
import { useRouter } from "vue-router";
import ProductView from "../../components/product/ProductView.vue";
// import api from "../../service/api";
import ProductTabNav from "./tab/ProductTabNav.vue";
import { productTabs } from "./tab";
import PurchaseJumbo from "./PurchaseJumbo.vue";
import "./product-store";
import { useStore } from "vuex";
const store = useStore();
const { activeTab } = productTabs;
productTabs.setActiveAt(0);

const router = useRouter();
const products = computed(() => store.getters["product/onlineProducts"]);

const gotoOrderForm = (
  /** @type {{method: String, product: Product}} */ evt
) => {
  const { method, product } = evt;
  router.push({
    path: `/purchase/order/${product.code}`,
    params: { method },
  });
};
watch(activeTab, (tab) => {
  const { cmd } = tab;
  if (cmd === "book") {
    const book = store.getters["product/bookProduct"];
    router.push(`/purchase/order/${book.code}`);
  } else if (cmd === "groupOrder") {
    router.push("/purchase/contact");
  }
});
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
.prod-list {
  margin-top: 5rem;
  margin-bottom: 5rem;
  section {
    text-align: center;
    margin-bottom: 6rem;
    h1 {
      font-family: "NanumSquareRound", "Noto Sans KR", sans-serif;

      font-weight: 900;
    }
  }
  .row > * {
    padding-top: 8px;
    padding-bottom: 8px;
  }
  .product {
    height: 100%;
  }
  .group-order {
    display: flex;
    button {
      flex: 1 1 auto;
      border-radius: 16px;
      font-size: 1.5rem;
      padding-top: 8px;
      padding-bottom: 8px;
    }
  }
}
@include mobile {
  .prod-list {
    margin-top: 1rem;
    margin-bottom: 1rem;
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
