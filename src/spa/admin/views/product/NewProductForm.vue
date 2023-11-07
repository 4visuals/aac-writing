<template>
  <div class="prod-form">
    <h3>
      <span :class="['sales', salesType]">{{ SALES[salesType] }}</span
      ><span>상품 {{ editMode ? "편집" : "등록" }}</span>
    </h3>
    <TextFieldView
      v-for="form in forms"
      :key="form.wid"
      :formModel="form"
      :readOnly="editMode && form.wid !== 'name' && form.wid !== 'description'"
      @value="commit"
    />
    <div class="fotter">
      <button class="nude blue" @click="buildProduct">
        {{ editMode ? "상품 편집" : "상품 추가" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, defineProps } from "vue";
import { TextFieldView, InputForm } from "../../../../components/form";
import Product from "../../../../entity/product";

const props = defineProps(["product", "salesType"]);
const emit = defineEmits(["product"]);

const editMode = !!props.product;
const SALES = {
  RT: "소매",
  GB: "공구",
};
const forms = [
  new InputForm({
    wid: "name",
    title: "상품명",
    placeholder: "상품명 입력",
    desc: "상품명 입력",
    value: props.product ? props.product.name : "",
  }),
  new InputForm({
    wid: "description",
    title: "상세 설명",
    desc: "상세 정보 입력",
    placeholder: "상세 정보",
    value: props.product ? props.product.description : "",
  }),
];
if (props.salesType === "RT" || props.product?.isRetail()) {
  forms.push(
    new InputForm({
      wid: "days",
      title: "사용 기간",
      desc: "가급적 30일 단위로 맞춰주세요.(30일, 180일)",
      placeholder: "사용 기간(단위: 일)",
      value: props.product?.durationInHours / 24 || "0",
    }),
    new InputForm({
      wid: "priceKrWon",
      title: "정가",
      type: "number",
      desc: "정가(Korean Won)",
      placeholder: "금액 입력",
      value: props.product?.priceKrWon || "0",
    }),
    new InputForm({
      wid: "discountKrWon",
      title: "할인 금액",
      type: "number",
      desc: "구매 시 적용되는 할인 금액. 입력한 가격에서 할인 금액을 뺀 액수가 실제 상품 가격입니다.",
      placeholder: "할인 금액(없으면 0으로 입력)",
      value: props.product?.discountKrWon || "0",
    })
  );
}

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
  if (props.product) {
    // 상품 편집 모드
    product.seq = props.product.seq;
    product.code = props.product.code;
  } else {
    // 상품 생성 모드
    product.setSalesType(props.salesType);
  }
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
  h3 {
    display: flex;
    align-items: center;
    column-gap: 8px;
    margin-bottom: 8px;
  }
}
</style>
