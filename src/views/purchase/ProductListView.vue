<template>
  <div class="prod-list container">
    <div class="row">
      <div
        v-for="(prod, index) in products"
        :key="prod.code"
        class="col-xs-12 col-sm-6 col-md-6 col-lg-6"
      >
        <ProductView
          :product="prod"
          :theme="themes[index]"
          @order="gotoOrderForm"
          class="product"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import ProductView from "../../components/product/ProductView.vue";
// import { OrderForm } from "./order-form";
import api from "../../service/api";

export default {
  components: {
    ProductView,
  },
  setup() {
    const router = useRouter();
    const products = ref(null);
    const themes = ["red", "blue", "green", "red", "blue", "green"];

    const gotoOrderForm = (
      /** @type {{method: String, product: Product}} */ evt
    ) => {
      const { method, product } = evt;
      console.log(router.push);
      console.log(method, product);
      // new OrderForm(method, product.code).save();
      router.push({
        path: `/purchase/order/${product.code}`,
        params: { method },
      });
    };
    api.product.list().then((res) => {
      products.value = res.products;
    });
    return { themes, products, gotoOrderForm };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
.prod-list {
  margin-top: 5rem;
  margin-bottom: 5rem;
  .row > * {
    padding-top: 8px;
    padding-bottom: 8px;
  }
  .product {
    height: 100%;
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
