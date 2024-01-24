<template>
  <div class="order">
    <div class="floating">
      <a v-if="order.isPaidOrder()" target="_blank" :href="order.receipt_url">
        <AppIcon icon="receipt" fsze="20px" /><span>매출전표</span>
      </a>
    </div>
    <h5>
      <span :class="['sales', order.product.salesType]"
        ><span v-if="order.product.salesType === 'GB'">공동구매</span
        ><span v-else>단체구매</span></span
      ><span class="pay" :class="[order.getPaymentClass()]">{{
        order.getPaymentText()
      }}</span
      ><span class="currency">₩{{ formatCurrency(order.totalAmount) }}</span>
    </h5>
    <h3>
      <span class="prod">{{ order.product?.name }}</span>
    </h3>
    <ul v-if="order.isPaidOrder()">
      <li>결제일: {{ formatTime(order.paidTime) }}</li>
    </ul>
    <div v-else>
      <p v-if="order.product.salesType === 'GB'">
        {{ teacher.name }}님이 신청하신 공동구매 결제를 완료해주세요.
      </p>
      <p v-else>이용권 : {{ order.licenseQtt }} 매</p>
      <p style="text-align: center">
        <FormButton
          v-if="order.isPendingOrder()"
          icon="payment"
          fsze="20px"
          text="바로결제"
          @click="$emit('payment', order)"
        >
        </FormButton>
      </p>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, defineProps } from "vue";
import useOrderFunction from "./useOrderFunction";
import FormButton from "@/components/form/FormButton.vue";
import { useStore } from "vuex";
defineProps({
  order: Object,
});
defineEmits({
  /** @type {Order} */
  payment: Object,
});
const store = useStore();
const teacher = store.getters["user/currentUser"];
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

      font-weight: 600;
      border-radius: 4px;
      font-size: 1rem;
      &.GB {
        background-color: #b8230b;
        color: white;
      }
      &.RT {
        background-color: #0b45b8;
        color: white;
      }
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
