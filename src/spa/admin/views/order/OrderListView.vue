<template>
  <div class="order-view">
    <h3>구매 내역</h3>
    <div class="orders">
      <div v-for="order in ordersRef" :key="order.orderUuid" class="order">
        <span class="state" :class="[order.orderState]">{{
          stateText(order)
        }}</span>
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

const stateTextMap = {
  RDY: "결제 대기",
  ATV: "결제 완료",
  CNU: "사용자 취소",
  CNE: "결제 오류",
};
export default {
  setup() {
    const ordersRef = ref(null);

    const toTimeText = (millis) => time.toYMD(Date.parse(millis));
    const loadOrders = () => {
      api.order.list().then((res) => {
        ordersRef.value = res.orders;
        console.log(res.orders);
      });
    };
    const stateText = (order) => {
      return stateTextMap[order.orderState] || order.orderState;
    };
    loadOrders();
    return { ordersRef, toTimeText, stateText };
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
      position: relative;
      padding: 4px;
      border: 1px solid #aaa;
      background-color: white;
      .state {
        position: absolute;
        padding: 4px 8px;
        top: 0;
        right: 0;
        &.ATV {
          background-color: #93ff6c;
        }
        &.RDY {
          background-color: #5f5f5f;
          color: white;
        }
        &.CNU {
          background-color: #ef5800;
          color: white;
        }
      }
    }
  }
}
</style>
