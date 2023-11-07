<template>
  <div class="prod">
    <div class="meta">
      <h3>상품 관리</h3>
    </div>
    <TabView :model="tabModel">
      <div class="tab-body">
        <div v-if="activeTab.cmd === 'RT'" class="retail">
          <ProductListView
            v-if="productsRef.retails"
            :products="productsRef.retails"
            @selected="showEditForm"
            @create="showNewProductForm('RT')"
          />
        </div>
        <div v-else class="gbuying">
          <GrouBuyingProductList
            v-if="productsRef.gbuying"
            :products="productsRef.gbuying"
            @create="showNewProductForm('GB')"
          />
        </div>
      </div>
    </TabView>
  </div>
</template>

<script setup>
import api from "../service/admin-api";
import modal from "@/components/modal";
import { TabModel, TabView } from "@/components/tab";
import NewProductForm from "./product/NewProductForm.vue";
import GrouBuyingProductList from "./product/GroupBuyingProductList.vue";
import ProductListView from "./product/ProductListView.vue";
import { ref } from "vue";

/** @type { import('../../../components/tab').TabModel } */
const tabModel = TabModel.create([
  { text: "소매상품", cmd: "RT", clazz: "retail" },
  { text: "공구상품", cmd: "GB", clazz: "gbuying" },
]);
const { activeTab } = tabModel;

const productsRef = ref({ retails: undefined, gbuying: undefined });

const partitioning = (products) => {
  const retails = products.filter((prod) => prod.isRetail());
  const gbuying = products.filter((prod) => prod.isGroupBuying());

  // 공동구매 제품은 시작일의 내림차순으로 정렬해서 제공함
  gbuying.sort((a, b) => -1 * a.activatedAt.localeCompare(b.activatedAt));

  productsRef.value.retails = retails;
  productsRef.value.gbuying = gbuying;
};
api.product.list().then((res) => {
  console.log(res);
  partitioning(res.products);
});
const createProduct = (product) => {
  delete product._data;
  api.product.create(product).then((res) => {
    const { product } = res;
    const { salesType } = product;
    if (salesType === "RT") {
      productsRef.value.retails.push(product);
    } else if (salesType == "GB") {
      productsRef.value.gbuying.unshift(product);
    }
    modal.closeModal();
  });
};
const updateProduct = (product) => {
  api.product.update(product).then((res) => {
    const { product } = res;
    const idx = productsRef.value.findIndex((prod) => prod.seq === product.seq);
    productsRef.value.splice(idx, 1, product);
  });
};
/**
 *
 * @param {'RT' | 'GB'} salesType 소매 또는 공구
 */
const showNewProductForm = (salesType) => {
  modal.showModal(NewProductForm, {
    width: "sm",
    fill: false,
    props: {
      salesType,
    },
    events: { product: createProduct },
  });
};
const showEditForm = (product) => {
  modal.showModal(NewProductForm, {
    width: "sm",
    fill: false,
    props: {
      product,
    },
    events: { product: updateProduct },
  });
};
</script>

<style lang="scss" scoped>
.prod {
  .tab-body {
    margin-top: 8px;
  }
}
</style>
