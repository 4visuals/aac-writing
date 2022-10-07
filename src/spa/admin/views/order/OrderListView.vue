<template>
  <div class="order-view">
    <h3>구매 내역</h3>
    <div class="orders">
      <div v-for="order in ordersRef" :key="order.orderUuid" class="order">
        <div class="prod">{{ order.product.name }}</div>
        <div class="time init">{{ toTimeText(order.orderTime) }}</div>
        <div class="qtt">{{ order.itemCount }}매</div>
        <div class="customer">
          <span class="name">{{ order.customer.name }}</span
          ><span class="email">{{ order.customer.email }}</span>
        </div>
        <div class="price">{{ order.totalAmount }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { time } from "@/service/util";

import api from "../../service/admin-api";
import { ref } from "vue";
export default {
  setup() {
    const ordersRef = ref(null);

    const toTimeText = (millis) => time.toYMD(millis);
    const loadOrders = () => {
      api.order.list().then((res) => {
        ordersRef.value = res.orders;
        console.log(res.orders);
      });
    };
    loadOrders();
    return { ordersRef, toTimeText };
  },
};
</script>

<style lang="scss" scoped>
.order-view {
  .orders {
    display: flex;
    flex-direction: column;
    row-gap: 8px;
    margin-top: 16px;
    padding: 0 8px;
    max-width: 400px;
    .order {
      padding: 4px;
      border: 1px solid #aaa;
      background-color: white;
    }
  }
}
</style>
