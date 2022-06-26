<template>
  <div class="refresh">
    <ParaText>새로운 버전({{ env.VERSION }})</ParaText>
    <SpanText>버튼을 눌러 페이지를 새로고침해주세요.</SpanText>
    <div class="form">
      <AacButton
        :inline="true"
        size="sm"
        rect
        borderless
        text="새로고침"
        @click="refresh"
      />
    </div>
  </div>
</template>

<script>
import env from "@/service/env";
import SpanText from "@/components/text/ParaText.vue";
import ParaText from "@/components/text/SpanText.vue";
export default {
  components: {
    ParaText,
    SpanText,
  },
  setup() {
    const refresh = () => {
      document.location.reload();
    };
    return {
      env,
      refresh,
    };
  },
};
</script>

<style lang="scss" scoped>
.refresh {
  padding: 16px;
  background-color: #d23d70;
  color: white;
  position: fixed;
  bottom: 16px;
  left: 16px;
  right: 16px;
  z-index: 500;
  .form {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
