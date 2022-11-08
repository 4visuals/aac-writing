<template>
  <div>
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
          <span>{{ prod.name }}</span>
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
const asDay = (hours) => hours / 24;
</script>
<script>
export default {
  props: ["products"],
  setup() {},
};
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
    }
  }
}
</style>
