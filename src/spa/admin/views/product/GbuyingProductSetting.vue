<template>
  <section>
    <h3>{{ product.name }}</h3>
    <div class="action">
      <p>참여자에게 주문을 발송합니다.</p>
      <FormButton
        text="주문 발송"
        theme="blue"
        @click="$emit('ordering', product)"
      />
    </div>
    <div class="action">
      <p>진행 중인 상품을 만료 처리합니다.</p>
      <FormButton
        text="만료처리"
        theme="red"
        @click="$emit('delete', product)"
      />
    </div>
  </section>
</template>

<script setup>
import { defineProps } from "vue";
import FormButton from "@/components/form/FormButton.vue";
defineProps({
  product: {
    type: Object,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
section {
  padding: 16px;
}
</style>
