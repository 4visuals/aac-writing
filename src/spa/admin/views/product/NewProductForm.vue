<template>
  <div class="prod-form">
    <h3>상품 등록</h3>
    <TextFieldView
      v-for="form in forms"
      :key="form.wid"
      :formModel="form"
      @value="commit"
    />
    <div class="fotter">
      <button class="nude bue" @click="buildProduct">추가</button>
    </div>
  </div>
</template>

<script setup>
import { TextFieldView, InputForm } from "../../../../components/form";
import Product from "../../../../entity/product";

// eslint-disable-next-line no-undef
const emit = defineEmits(["product"]);
const forms = [
  new InputForm({
    wid: "name",
    title: "상품명",
    placeholder: "상품명 입력",
    desc: "상품명 입력",
    value: "",
  }),
  new InputForm({
    wid: "description",
    title: "상세 설명",
    desc: "상세 정보 입력",
    placeholder: "상세 정보",
    value: "",
  }),
  new InputForm({
    wid: "days",
    title: "사용 기간",
    desc: "가급적 30일 단위로 맞춰주세요.(30일, 180일)",
    placeholder: "사용 기간(단위: 일)",
    value: "0",
  }),
  new InputForm({
    wid: "priceKrWon",
    title: "가격",
    type: "number",
    desc: "가격(Korean Won)",
    placeholder: "금액 입력",
    value: "",
  }),
  new InputForm({
    wid: "discountKrWon",
    title: "할인 금액",
    type: "number",
    desc: "구매 시 적용되는 할인 금액. 입력한 가격에서 할인 금액을 뺀 액수가 실제 상품 가격입니다.",
    placeholder: "할인 금액(없으면 0으로 입력)",
    value: "0",
  }),
];

const commit = ({ inputForm, value, commit }) => {
  const val = inputForm.type === "number" ? parseInt(value) : value;
  commit(val);
};
const buildProduct = () => {
  const prod = {};
  forms.forEach((form) => {
    const { wid, value } = form;
    if (wid === "days") {
      prod.durationInHours = parseInt(value) * 24;
    } else {
      prod[wid] = value;
    }
  });
  const product = new Product(prod);
  console.log("[prod]", product);
  emit("product", product);
};
</script>
<script>
export default {
  setup() {
    return {};
  },
  components: { TextFieldView },
};
</script>

<style lang="scss" scoped>
.prod-form {
  padding: 16px;
}
</style>
