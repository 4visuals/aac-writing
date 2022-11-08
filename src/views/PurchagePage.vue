<template>
  <div class="purchase" @scroll="detectScroll">
    <TeacherNav :fixed="fixedMenu" @logout="doLogout" />
    <ProductBanner v-if="products" :products="products" />
  </div>
</template>

<script>
import { ref } from "vue";
import TeacherNav from "./nav/TeacherNav.vue";
import ProductBanner from "../components/product/ProductBanner.vue";
import api from "../service/api";
import { useStore } from "vuex";

export default {
  components: {
    TeacherNav,
    ProductBanner,
  },
  setup() {
    const store = useStore();
    const products = ref(null);
    const fixedMenu = ref(false);

    const detectScroll = (e) => {
      const scroll = e.target.scrollTop;
      fixedMenu.value = scroll > 80;
    };

    api.product.list().then((res) => {
      products.value = res.products;
    });

    store.commit("ui/setNavSize", { expanded: false, topPadding: 0 });

    return { products, fixedMenu, detectScroll };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
.purchase {
  height: 100%;
  overflow-y: auto;
  padding-top: 3.5rem;
}
@include tablet {
  .purchase {
    padding-top: 10rem;
  }
}
@include desktop {
  .purchase {
    padding-top: 10rem;
  }
}
</style>
