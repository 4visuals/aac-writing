<template>
  <section class="addr">
    <div class="dimmer" @click="searchResponse.clearDelivery()"></div>
    <div v-if="searchResponse.delivery.road" class="form">
      <p>
        <span class="zipcode">{{ searchResponse.delivery.zipCode }}</span
        ><span class="base">{{ searchResponse.delivery.baseAddress }}</span>
      </p>
      <label>기본주소</label>
      <input
        class="field"
        type="text"
        placeholder="상세주소"
        :value="searchResponse.delivery.baseAddress"
        @input="(e) => searchResponse.delivery.setBaseAddress(e.target.value)"
      />
      <label
        >상세주소
        <span class="more"
          >상세주소가 없으면 "1층"으로 입력해주세요.</span
        ></label
      >
      <input
        class="field"
        type="text"
        placeholder="상세주소(없으면 '1층'입력)"
        @input="(e) => searchResponse.delivery.setDetailAddress(e.target.value)"
      />
      <label>받는사람</label>
      <input
        class="field"
        type="text"
        placeholder="택배수령인 이름"
        @input="(e) => searchResponse.delivery.setReceiverName(e.target.value)"
      />
      <label>전화번호</label>
      <input
        class="field"
        type="text"
        placeholder="010-0000-0000"
        @input="(e) => searchResponse.delivery.setPhoneNumber(e.target.value)"
      />
      <div>
        <button
          class="nude blue"
          :disabled="!searchResponse.delivery.valid()"
          @click="checkForm"
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
import { defineProps, defineEmits } from "vue";
import toast from "../toast";

const props = defineProps(["searchResponse"]);
const emit = defineEmits(["success"]);

const checkForm = () => {
  const { delivery } = props.searchResponse;
  if (!delivery.checkForm()) {
    toast.error("전화번호를 올바로 입력해주세요");
    return;
  }
  emit("success");
};
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
    label {
      display: flex;
      align-items: center;
      .more {
        color: crimson;
        margin-left: 8px;
      }
    }
    p {
      font-size: 1.3rem;
      display: flex;
      align-items: center;
      column-gap: 8px;
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
