<template>
  <div v-if="searchResponse" class="addr-search">
    <div v-if="searchResponse.error" class="error">결과 없음</div>
    <div v-else class="results">
      <div
        v-for="result in searchResponse.results"
        :key="result.address_name"
        class="each"
      >
        <button
          class="nude"
          :class="{ active: searchResponse.activeResult === result }"
          @click="searchResponse.setActive(result)"
        >
          <span class="addr">{{ result.address_name }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

defineProps(["searchResponse"]);
</script>

<style lang="scss" scoped>
.addr-search {
  .results {
    display: flex;
    flex-direction: column;
    row-gap: 6px;
    .each {
      .nude {
        padding: 2px 8px;
        background-color: #ffffff;
        border-radius: 16px;
        box-shadow: 1px 1px 6px #0000004d, 0px 0px 3px #0000006d;
        font-weight: 400;
        &.active {
          background-color: tomato;
          color: white;
        }
      }
    }
  }
}
</style>
