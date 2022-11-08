<template>
  <div class="prod">
    <div class="meta">
      <h3>상품 관리</h3>
      <div class="ctrl">
        <button class="nude blue" @click="showNewProductForm">상품 추가</button>
      </div>
    </div>
    <ProductListView v-if="products" :products="products" />
  </div>
</template>

<script setup>
import api from "../service/admin-api";
import modal from "@/components/modal";
import NewProductForm from "./product/NewProductForm.vue";

const products = ref(null);
api.product.list().then((res) => {
  console.log(res);
  products.value = res.products;
});
const createProduct = (product) => {
  delete product._data;
  api.product.create(product).then((res) => {
    console.log(product);
  });
};
const showNewProductForm = () => {
  modal.showModal(NewProductForm, {
    width: "sm",
    fill: false,
    events: { product: createProduct },
  });
};
</script>
<script>
import { ref } from "vue";
import ProductListView from "./product/ProductListView.vue";

export default {
  components: {
    ProductListView,
  },
};
</script>

<style lang="scss" scoped></style>
