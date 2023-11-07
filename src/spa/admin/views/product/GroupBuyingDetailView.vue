<template>
  <div class="gbuying">
    <div v-if="formRefs" class="forms">
      <div v-if="formRefs.length === 0" class="empty">참여자 없음</div>
      <button
        v-for="form in formRefs"
        :key="form.seq"
        @click="showEditOrderForm(form)"
        class="form nude"
      >
        <span class="item email"
          >{{ form.senderEmail }}({{ form.sender.name }})
        </span>
        <span class="item price">{{ form.getPrice() }}원</span>
        <span class="item qtt">{{ form.getQtt() }}개</span>
      </button>
      <button class="btn-add nude blue round" @click="showOrderForm()">
        구매자 추가
      </button>
    </div>
    <LoadingIcon v-else :pending="pending" />
  </div>
</template>

<script setup>
import { defineEmits, defineProps, ref } from "vue";
import modal from "@/components/modal";
import adminApi from "../../service/admin-api";
import LoadingIcon from "../../../../components/LoadingIcon.vue";
import GroupBuyingFormView from "../../../../views/purchase/GroupBuyingFormView.vue";
import GroupBuyingEditForm from "./GroupBuyingEditForm.vue";

const props = defineProps({
  product: {
    /** @type { import('vue').PropType<Product> } */
    type: Object,
    required: true,
  },
});
const emit = defineEmits({
  /** @type { import('vue').PropType<GroupOrderFormt> } */
  forms: Object,
  /** @type {import('vue'.PropType<{product:Product, form: GroupOrderForm}>)} */
  "edit-form": Object,
});
const pending = ref({
  text: "상품 불러오는 중...",
  error: false,
});
/** @type { import('../../../../entity/group-order-form').GroupOrderForm} */
const formRefs = ref(undefined);

const createOrderForm = (form) => {
  adminApi.order.gbuying.addForm(form).then((form) => {
    formRefs.value.push(form);
    modal.closeModal();
    // modal;
  });
};
/**
 * 공구 참여 양색 화면
 */
const showOrderForm = () => {
  const { product } = props;
  modal.showModal(GroupBuyingFormView, {
    width: "sm",
    fill: true,
    props: {
      product,
    },
    events: {
      submit: createOrderForm,
      close: () => modal.closeModal(),
    },
  });
};

const doUpdateForm = (e, form) => {
  const { price, qtt } = e;
  adminApi.order.gbuying.updateForm(form.seq, { price, qtt }).then((form) => {
    form.content.price = price;
    form.content.qtt = qtt;
    const forms = formRefs.value;
    const idx = forms.findIndex((frm) => frm.seq === form.seq);
    forms.splice(idx, 1, form);
    modal.closeModal();
  });
};
const doDeleteForm = (form) => {
  adminApi.order.gbuying.deleteForm(form.seq).then(() => {
    const forms = formRefs.value;
    const idx = forms.findIndex((frm) => frm.seq === form.seq);
    forms.splice(idx, 1);
    modal.closeModal();
  });
};
/**
 * 공구 참여 양식 수정 및 삭제 화면
 * @param {GroupOrderForm} form
 */
const showEditOrderForm = (form) => {
  modal.showModal(GroupBuyingEditForm, {
    width: "sm",
    fill: false,
    props: {
      product: props.product,
      form,
    },
    events: {
      update: (e) => doUpdateForm(e, form),
      delete: (form) => doDeleteForm(form),
    },
  });
};

const loadOrderForms = () => {
  const { product } = props;
  adminApi.order.gbuying.listOrderForms(product.code).then((forms) => {
    formRefs.value = forms;
    emit("forms", forms);
  });
};

loadOrderForms();
</script>

<style lang="scss" scoped>
.forms {
  .form {
    position: relative;
    display: flex;
    flex-direction: column;
    border-top: 1px solid #ccc;
    padding: 4px 8px;
    width: 100%;
    font-size: 1.2rem;
    font-weight: 400;
    &:hover {
      background-color: #eee;
    }
  }
}
</style>
