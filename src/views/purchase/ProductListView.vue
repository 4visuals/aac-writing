<template>
  <div class="prod-list container">
    <div class="row">
      <div class="col-12">
        <section>
          <h1>구매하기</h1>
        </section>
      </div>
    </div>
    <div class="row">
      <div
        v-for="prod in products"
        :key="prod.code"
        class="col-xs-12 col-sm-12 col-md-6 col-lg-6"
      >
        <ProductView :product="prod" @order="gotoOrderForm" class="product" />
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12 group-order">
        <button @click="gotoGroupOrder" class="nude red">단체 구매 문의</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import ProductView from "../../components/product/ProductView.vue";
import api from "../../service/api";

export default {
  components: {
    ProductView,
  },
  setup() {
    const router = useRouter();
    const products = ref(null);

    const gotoOrderForm = (
      /** @type {{method: String, product: Product}} */ evt
    ) => {
      const { method, product } = evt;
      // new OrderForm(method, product.code).save();
      router.push({
        path: `/purchase/order/${product.code}`,
        params: { method },
      });
    };
    const gotoGroupOrder = () => {
      router.push("/purchase/contact");
    };
    api.product.list().then((res) => {
      products.value = res.products;
    });
    return { products, gotoOrderForm, gotoGroupOrder };
  },
};
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
