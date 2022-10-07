<template>
  <div class="loading-view" :class="{ error: pending.error }">
    <div class="loading" v-if="pending.state == 'LOADING'">LOADING</div>
    <div class="error" v-if="pending.error">
      <ParaText>오류 발생({{ pending.msg }})</ParaText>
      <AacButton
        :inline="true"
        theme="blue"
        text="닫기"
        @click="$emit(eventName || 'close')"
      />
    </div>
  </div>
</template>

<script>
import { ParaText } from "@/components/text";
import { AacButton } from "@/components/form";
export default {
  components: {
    ParaText,
    AacButton,
  },
  props: ["pending", "eventName"],
};
</script>

<style lang="scss" scoped>
.loading-view {
  position: absolute;
  z-index: 1000;
  background-color: #ffffffac;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  .error {
    display: flex;
    row-gap: 16px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff2cd;
    color: #948453;
    height: 100%;
  }
}
</style>
