<template>
  <div class="delivery-info">
    <p>{{ deliveryInfo.baseAddress }} {{ deliveryInfo.detailAddress }}</p>
    <p>{{ deliveryInfo.receiverName }}</p>
    <p>
      <span class="zip">{{ deliveryInfo.zipCode }}</span>
    </p>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
defineProps(["deliveryInfo"]);
</script>

<style lang="scss" scoped>
.delivery-info {
  display: flex;
  flex-direction: column;
  background-color: #e7f8ff;
  row-gap: 4px;
  padding: 8px;
  margin-top: 8px;
  border-top: 1px solid #73b7ff;
  font-size: 1.1rem;
  font-weight: 600;
  .zip {
    padding: 4px;
    background-color: darkgreen;
    color: white;
    letter-spacing: 1px;
  }
}
</style>
