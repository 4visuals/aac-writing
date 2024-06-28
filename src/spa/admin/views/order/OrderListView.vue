<template>
  <div class="order-view">
    <div class="sticky">
      <h3>구매 내역</h3>
      <div class="header">
        <nav>
          <button
            v-for="tab in tabs"
            :key="tab.type"
            class="nude tab-item"
            :class="{ active: activeTab.type === tab.type }"
            @click="setTab(tab)"
          >
            {{ tab.text }}
          </button>
        </nav>
        <nav>
          <label><input type="checkbox" v-model="trialIncude" />평가판</label>
        </nav>
      </div>
    </div>
    <div class="orders">
      <div v-for="order in ordersRef" :key="order.orderUuid" class="order">
        <span class="state" :class="[order.orderState]">{{
          stateText(order)
        }}</span>
        <div class="prod">
          <span v-if="order.isDigitalType()" class="digital true">이용권</span
          ><span v-else class="digital false">교보재</span>
          <span class="name">{{ order.product.name }}</span>
        </div>
        <div class="time init">{{ toTimeText(order.orderTime) }}</div>
        <div class="qtt">{{ order.itemCount }}매</div>
        <div class="customer">
          <span class="name">{{ order.customer.name }}</span
          ><span class="email">{{ order.customer.email }}</span>
        </div>
        <div class="price">{{ order.totalAmount }}</div>
        <div v-if="order.deliveryInfo" class="delivery">
          <DeliveryInfoView :delivery-info="order.deliveryInfo" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { time } from "@/service/util";

import api from "../../service/admin-api";
import { ref, shallowRef, watch } from "vue";
import Order from "../../../../entity/order";
import DeliveryInfoView from "../../../../components/map/DeliveryInfoView.vue";
import util from "../../../../service/util";

const stateTextMap = {
  ATV: "결제 완료",
  CNU: "사용자 취소",
  CNE: "결제 오류",
  RDY: "결제 대기",
};

const trialIncude = ref(true);
const tabs = Object.keys(stateTextMap).map((type) => ({
  type,
  text: stateTextMap[type],
}));
const activeTab = shallowRef(tabs[0]);
const ordersRef = ref(null);
const setTab = (tab) => {
  activeTab.value = tab;
};
/**
 * @type {Map<string, Order>}
 */
let orderGroupMap = undefined;

const toTimeText = (millis) => time.toYMD(Date.parse(millis));
const loadOrders = () => {
  api.order.list().then((res) => {
    const orders = res.orders.map((order) => new Order(order));
    orderGroupMap = util.arr.groupByMap(
      orders,
      (odr) => odr.orderState,
      () => [],
      (holder, odr) => {
        holder.push(odr);
      }
    );
    ordersRef.value = res.orders.map((order) => new Order(order));
  });
};
const stateText = (order) => {
  return stateTextMap[order.orderState] || order.orderState;
};
/**
 *
 * @param {'ATV'|'CNU'|'CNE'|'PND'} orderType
 */
const drawOrders = (orderType) => {
  if (orderGroupMap) {
    const orders = orderGroupMap.get(orderType);
    ordersRef.value = trialIncude.value
      ? orders
      : orders.filter((odr) => !odr.trialOrder);
  }
};
loadOrders();

watch(
  activeTab,
  (tab) => {
    console.log("[tab]", tab);
    drawOrders(tab.type);
  },
  {
    immediate: true,
  }
);
watch(trialIncude, () => {
  drawOrders(activeTab.value.type);
});
</script>

<style lang="scss" scoped>
.order-view {
  .sticky {
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: white;
    border-bottom: 1px solid;
    .header {
      display: flex;
      nav {
        display: flex;
        align-items: center;
        label {
          display: flex;
          align-items: center;
          font-size: 1.2rem;
        }
        .nude {
          &.active {
            background-color: var(--bs-blue);
            color: white;
          }
        }
      }
    }
  }
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
      .prod {
        display: inline-flex;
        column-gap: 8px;
        align-items: center;
        .digital {
          color: white;
          padding: 2px 4px;
          &.true {
            background-color: darkgreen;
          }
          &.false {
            background-color: crimson;
          }
        }
        .name {
          font-size: 1.1rem;
          font-weight: 600;
        }
      }
    }
  }
}
</style>
