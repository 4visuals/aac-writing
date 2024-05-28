<template>
  <div class="edit-form">
    <h3>
      <span class="onum">#{{ order.orderNum }}</span>
    </h3>
    <div class="info">
      <span class="onum">결제 - {{ order.paidTimeText }}</span>
      <span class="onum">만료 - {{ order.expiredTimeText }}</span>
    </div>
    <div
      v-if="order.isAlive() && order.isPaid() && order.isGroupOrder()"
      class="edit"
    >
      <TextFieldView :formModel="forms[0]" @value="handleDate" :delay="20" />
      <button class="nude" :disabled="disabled" @click="commit">수정</button>
    </div>
  </div>
</template>

<script setup>
import { InputForm, TextFieldView } from "@/components/form";
import { defineProps, defineEmits, ref } from "vue";

const props = defineProps(["order"]);
const emits = defineEmits(["commit"]);
let expDate = "" + props.order.expiredDateText;
const disabled = ref(true);
const forms = [
  new InputForm({
    wid: "expdate",
    title: "만료일",
    desc: "만료일 연장",
    status: "active",
    value: expDate,
    error: null,
  }),
];

const commit = () => {
  emits("commit", { expDate, order: props.order });
};

const handleDate = ({ inputForm, value, commit }) => {
  console.log(value, inputForm);
  expDate = value;
  disabled.value = props.order.expiredDateText === expDate;
  commit(value);
};
</script>

<style lang="scss" scoped>
.edit-form {
  padding: 16px;
  .info {
    display: flex;
    flex-direction: column;
  }
}
</style>
