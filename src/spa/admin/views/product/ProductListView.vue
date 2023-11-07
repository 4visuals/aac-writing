<template>
  <div>
    <div class="ctrl">
      <button class="nude blue" @click="$emit('create')">소매 상품 추가</button>
    </div>
    <table class="product">
      <tr>
        <th>판매용</th>
        <th>상품명</th>
        <th>원가</th>
        <th>할인</th>
        <th>가격</th>
        <th>기간</th>
        <th></th>
      </tr>
      <tr
        v-for="prod in products"
        :key="prod.code"
        :class="{ beta: prod.beta }"
      >
        <td><span v-if="prod.beta">평가용</span><span v-else>판매용</span></td>
        <td>
          <span class="name" @click="$emit('selected', prod)">{{
            prod.name
          }}</span>
        </td>
        <td>
          <span>{{ prod.priceKrWon }}</span>
        </td>
        <td>
          <span>{{ prod.discountKrWon }}</span>
        </td>
        <td>
          <span>{{ prod.price }}</span>
        </td>
        <td class="dur">
          <span>{{ asDay(prod.durationInHours) }}일</span>
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
/**
 * 소매 상품 리스트
 */
defineProps({
  products: {
    /** @type { import('vue').PropType<Array<import('../../../../entity/product').default>>} */
    type: Array,
    required: true,
  },
});
const asDay = (hours) => hours / 24;
</script>

<style lang="scss" scoped>
.product {
  tr {
    th,
    td {
      padding: 4px;
      &.dur {
        text-align: right;
      }
      span.name {
        text-decoration: underline;
        color: blue;
        cursor: pointer;
      }
    }
  }
}
</style>
