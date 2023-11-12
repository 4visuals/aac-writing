<template>
  <div class="orders">
    <SectionBox v-if="orders && orders.length === 0"
      ><p>구매 내역이 없습니다.</p></SectionBox
    >
    <SectionBox v-for="order in orders" :key="order.seq" padding="8px">
      <GBuyingOrderView
        v-if="order.isGroupBuyingOrder()"
        :order="order"
        @payment="startPayment"
      />
      <RetailOrderView v-else :order="order" />
    </SectionBox>
    <div class="refund">
      <h3>환불 규정</h3>
      <section v-for="sec in refunds" :key="sec.id">
        <h5>{{ sec.title }}</h5>
        <ul>
          <li v-for="(desc, idx) in sec.descs" :key="idx">{{ desc }}</li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup>
import api from "@/service/api";
import { computed, ref, watch } from "vue";
import SectionBox from "../ui/SectionBox.vue";
import GBuyingOrderView from "./order/GBuyingOrderView.vue";
import RetailOrderView from "./order/RetailOrderView.vue";
import { PortOne } from "@/service/payment/portone";
import { useStore } from "vuex";
import toast from "@/components/toast";

const store = useStore();
const loginUser = computed(() => store.getters["user/currentUser"]);
const orders = ref(null);
const refunds = [
  {
    id: "00",
    title: "이용권 상품",
    descs: ["이용권 구매 후 7일 이내 환불 가능합니다."],
  },
];
const loadOrders = () => {
  api.order.list().then((res) => {
    orders.value = res.orders; // .map((order) => new Order(order));
  });
};

const startPayment = (order) => {
  new PortOne({
    loginUser: loginUser.value,
    product: order.product,
    order,
    method: "card",
  })
    .sendVerificationCode()
    .then((portOne) => portOne.startPayment())
    .then(() => {
      toast.success("페이지를 새로고침합니다.", "[결제 완료]");
      setTimeout(() => {
        document.location.reload();
      }, 1500);
    })
    .catch((err) => {
      const { error_msg } = err;
      if (error_msg) {
        toast.warn(error_msg);
      }
    });
};
watch(
  loginUser,
  (user) => {
    if (user) {
      loadOrders();
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.orders {
  max-width: 580px;
  .refund {
    margin-top: 24px;
    h3 {
      position: relative;
      font-weight: 900;
      margin-bottom: 16px;
      &::after {
        content: "";
        position: absolute;
        bottom: -4px;
        left: 0;
        right: 0;
        height: 1px;
        background-color: black;
      }
    }
    section {
      h5 {
        font-weight: 600;
      }
      ul {
        list-style: none;
        padding: 0;
      }
    }
  }
}
</style>
