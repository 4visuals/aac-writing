<template>
  <section class="addr">
    <div class="dimmer" @click="searchResponse.clearDelivery()"></div>
    <div v-if="searchResponse.delivery.road" class="form">
      <p>
        <span class="zipcode">{{ searchResponse.delivery.zipCode }}</span
        ><span class="base">{{ searchResponse.delivery.baseAddress }}</span>
      </p>
      <label>상세주소</label>
      <input
        class="field"
        type="text"
        placeholder="상세주소"
        @input="(e) => searchResponse.delivery.setDetailAddress(e.target.value)"
      />
      <label>받는사람(전화번호)</label>
      <input
        class="field"
        type="text"
        placeholder="택배수령인 이름(전화 번호 필수 입력)"
        @input="(e) => searchResponse.delivery.setReceiverName(e.target.value)"
      />
      <div>
        <button
          class="nude blue"
          :disabled="!searchResponse.delivery.valid()"
          @click="$emit('success')"
        >
          배송지 입력
        </button>
      </div>
    </div>
    <div v-else class="form">
      <h5>건물이 아닙니다.</h5>
      <p>
        <span>지도를 드래그해서 건물 위에</span><AppIcon icon="place" />
        <span>를 올립니다.</span>
      </p>
    </div>
  </section>
</template>

<script setup>
import { defineProps } from "vue";

defineProps(["searchResponse"]);
</script>

<style lang="scss" scoped>
section.addr {
  position: absolute;
  inset: 0;
  padding: 0;
  margin: 0;
  z-index: 150;
  height: 100%;
  .dimmer {
    position: absolute;
    inset: 0;
    background-color: #0000004d;
  }
  .form {
    z-index: 10;
    background-color: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    padding: 16px;
    display: flex;
    flex-direction: column;
    row-gap: 8px;
    p {
      font-size: 1.3rem;
      display: flex;
      align-items: center;
      .zipcode {
        background-color: darkgreen;
        color: white;
        padding: 2px 6px;
        font-size: 1rem;
      }
    }
  }
}
</style>
