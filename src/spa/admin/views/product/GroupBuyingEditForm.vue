<template>
  <section>
    <h3>{{ product.name }}</h3>
    <h5>{{ form.sender?.name }}</h5>
    <h5>{{ form.sender?.email }}</h5>
    <div v-for="form in inputs" :key="form.wid" class="elem">
      <TextFieldView
        :formModel="form"
        @value="
          ({ value, commit }) => {
            commit(value);
          }
        "
        :readOnly="form.readOnly"
      />
    </div>
    <div class="btns">
      <FormButton text="수정" theme="gray" @click="updateForm" />
      <FormButton text="삭제" theme="red" @click="deleteForm" />
    </div>
  </section>
</template>

<script setup>
import { defineEmits, defineProps, shallowRef } from "vue";
import { TextFieldView, InputForm } from "@/components/form";
import FormButton from "@/components/form/FormButton.vue";
// import modal from "../../../../components/modal";

const props = defineProps({
  product: Object,
  form: Object,
});
const emit = defineEmits(["update", "delete"]);
const inputs = shallowRef([
  new InputForm({
    wid: "_price",
    title: "가격",
    value: props.form.getPrice(),
    required: true,
    placeholder: "공구 참여가격",
  }),
  new InputForm({
    wid: "_qtt",
    title: "수량",
    value: props.form.getQtt(),
    required: true,
    placeholder: "구매 갯수",
  }),
]);

const updateForm = () => {
  const [price, qtt] = inputs.value.map((input) => input.value);
  emit("update", { price, qtt });
};
const deleteForm = () => {
  const { form } = props;
  if (window.confirm(`참여자 ${form.sender.name} 님을 삭제합니까?`)) {
    emit("delete", form);
  }
};
</script>

<style lang="scss" scoped>
section {
  padding: 16px;
}
</style>
