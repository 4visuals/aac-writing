<template>
  <div class="order">
    <div class="floating">
      <a v-if="order.receipt_url" target="_blank" :href="order.receipt_url">
        <AppIcon icon="receipt" fsze="20px" /><span>매출전표</span>
      </a>
      <a nohref v-else>
        <AppIcon icon="receipt" fsze="20px" /><span>전표없음</span>
      </a>
    </div>
    <h5>
      <span class="sales"
        ><span v-if="order.product.tax === 'N'">연습공책</span
        ><span v-else>이용권</span></span
      ><span class="pay" :class="[order.getPaymentClass()]">{{
        order.getPaymentText()
      }}</span
      ><span class="currency">₩{{ formatCurrency(order.totalAmount) }}</span>
    </h5>
    <h3>{{ order.product?.name }}</h3>
    <ul>
      <li>결제일: {{ formatTime(order.paidTime) }}</li>
    </ul>
  </div>
</template>

<script setup>
import { defineEmits, defineProps } from "vue";
// import Product from "../../../../../entity/product";
import useOrderFunction from "./useOrderFunction";
defineProps({
  order: Object,
});
defineEmits({
  /** @type {Order} */
  payment: Object,
});
const { formatCurrency, formatTime } = useOrderFunction();
</script>
<style lang="scss" scoped>
.order {
  position: relative;
  .floating {
    position: absolute;
    right: 0px;
    top: 0px;
    a {
      display: flex;
      align-items: center;
      text-decoration: none;
      column-gap: 4px;
    }
  }

  h5 {
    display: flex;
    align-items: center;
    column-gap: 8px;
    .sales {
      padding: 4px 8px;
      display: inline-flex;
      background-color: #1f9e1f;
      color: white;
      font-weight: 600;
      border-radius: 4px;
      font-size: 1rem;
    }
    .pay {
      font-weight: 600;
      padding: 4px 8px;
      font-size: 1rem;
      &.atv {
        background-color: #e4faf3;
        color: #067425;
      }
      &.rdy {
        background-color: #e3f5ff;
        color: #219dd1;
      }
    }
    .currency {
      font-size: 1.5rem;
      font-weight: 600;
    }
  }
  h3 {
    margin-top: 8px;
    font-weight: 600;
  }
}
</style>
