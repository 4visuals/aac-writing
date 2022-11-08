<template>
  <div class="banner container">
    <div class="inner row">
      <ProductView
        v-for="(prod, index) in products"
        :key="prod.code"
        :product="prod"
        :theme="themes[index]"
        class="item col-xs-12 col-sm-6 col-md-6 col-lg-3"
      />
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import ProductView from "./ProductView.vue";
defineProps(["products"]);

const themes = ["red", "blue", "green", "red", "blue", "green"];
</script>

<style lang="scss" scoped>
.banner {
  .inner {
    .item {
      position: relative;
      padding-top: 16px;
      padding-bottom: 16px;
    }
  }
}
</style>
