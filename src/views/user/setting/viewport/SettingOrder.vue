<template>
  <div class="orders">
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
    const refunds = [
      {
        id: "00",
        title: "이용권 상품",
        descs: [
          "이용권 구매 후 7일 이내 환불 가능합니다.",
          "이용권 구메 후 7일 이후에는 결제금액의 10%의 위약금과 정상가를 기준으로 한 사용일수에 따른 이용금액을 제한 후 환불됩니다.",
        ],
      },
      {
        id: "01",
        title: "패키지(이용권+인쇄물) 상품",
        descs: [
          "단순 변심에 의한 환불은 제품 수령 후 7일 이내 가능하며, 훼손하지 않은 인쇄물을 반환한 이후 환불 가능합니다. (왕복 택배비 고객 부담)",
          "제품 수령 7일 이후에는 이용권 만 환불 되며 결제금액의 10%의 위약금과 정상가를 기준으로 한 사용일수에 따른 이용금액을 제한 후 환불됩니다.",
          " 제품 불량으로 인한 교환 및 환불은 제품 수령 후 7일까지 무료로 가능합니다.  (7일 이후 요청시 왕복 택배비 고객 부담)",
        ],
      },
      {
        id: "02",
        title: "인쇄물",
        descs: [
          " 제품 불량으로 인한 교환 및 환불은 제품 수령 후 7일까지 무료로 가능합니다. ",
          "인쇄상 발생한 동일 색상의 미세한 색상 차이는 불량이 아니며, 이로 인한 교환 및 환불은 단순 변심으로 처리되어 왕복 배송비가 발생 되며 이는 고객 부담입니다. (7일 이후 요청시 왕복 택배비 고객 부담)",
        ],
      },
    ];
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
    return { orders, refunds, formatCurrency, formatTime };
  },
};
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
