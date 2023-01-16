<template>
  <div>
    <SectionBox v-if="orders && orders.length === 0"
      ><p>구매 내역이 없습니다.</p></SectionBox
    >
    <SectionBox v-for="order in orders" :key="order.seq">
      <div class="order">
        <h3>₩{{ formatCurrency(order.totalAmount) }}</h3>
        <ul>
          <li>상품명: {{ order.product?.name }}</li>
          <li>결제일: {{ formatTime(order.paidTime) }}</li>
        </ul>
      </div>
    </SectionBox>
  </div>
</template>

<script>
import api from "@/service/api";
import { ref } from "vue";
import SectionBox from "../ui/SectionBox.vue";
import util from "@/service/util";

export default {
  components: {
    SectionBox,
  },
  setup() {
    const orders = ref(null);

    const formatCurrency = (money) => util.currency.format(money);
    const formatTime = (utcText) => {
      const date = new Date(utcText);
      const [yy, mm, dd] = util.time.toYMD(date).split("-");
      const [h, m] = util.time.toHMS(date).split("-");
      return `${yy}년 ${mm}월 ${dd}일 ${h}시 ${m}분`;
    };
    api.order.list().then((res) => {
      orders.value = res.orders;
    });
    return { orders, formatCurrency, formatTime };
  },
};
</script>

<style lang="scss" scoped></style>
