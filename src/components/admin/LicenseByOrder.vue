<template>
  <div class="odr">
    <h5>
      <span
        ><span class="onum">#{{ order.orderNum }}</span
        ><span class="cnt">{{ order.licenses.length }}장</span></span
      ><button class="nude sm" @click="$emit('edit-order', order)">수정</button>
    </h5>
    <div class="licenses">
      <LicenseItem
        v-for="lcs in order.licenses"
        :students="students"
        :lcs="lcs"
        :active="active === lcs"
        :key="lcs.seq"
        size="xs"
        @click="$emit('license-click', lcs)"
      >
      </LicenseItem>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import LicenseItem from "./LicenseItem.vue";

defineProps(["active", "order", "students"]);
</script>

<style lang="scss" scoped>
.odr {
  h5 {
    display: flex;
    align-items: center;
    padding: 0px 8px;
    span {
      flex: 1 1 auto;
      font-size: 12px;
      & > .onum {
        padding: 4px 6px;
        font-weight: 600;
      }
    }
  }
  .licenses {
    padding: 0px 8px 8px;
  }
  .summary {
    padding: 0 8px;
    font-size: 10px;
    text-align: right;
  }
  .nude {
    font-weight: 600;
    padding: 4px;
    color: #005cd5;
  }
}
</style>
