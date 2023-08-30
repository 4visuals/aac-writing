<template>
  <div class="done" @click.stop="() => {}">
    <div class="inner">
      <h3>수고하셨습니다!</h3>
      <section>
        <ParaText>1,000개의 낱말과 600개의 문장</ParaText>
        <ParaText>낱말과 문장 읽어주기</ParaText>
        <ParaText>다양한 장면 그림</ParaText>
        <ParaText>이용권 구매 후 학습을 시작하세요</ParaText>
        <button class="nude purchase" @click="router.push('/purchase')">
          <span>이용권 구매하기</span>
        </button>
      </section>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ParaText } from "../../../components/text";
const router = useRouter();
</script>

<style lang="scss" scoped>
.done {
  width: 100%;
  background-image: url("/img/bg/pg4.svg");
  display: flex;
  flex-direction: row;
  justify-content: center;

  .inner {
    h3 {
      font-size: 2.25rem;
      text-align: center;
      font-weight: 600;
      margin: 4rem 0;
    }
    .purchase {
      border: 2px solid #1db270;
      color: #1db270;
      line-height: 1;
      border-radius: 20px;
      width: 100%;
      font-size: 1.8rem;
    }
    p {
      text-align: center;
      margin-bottom: 1.25rem;
    }
  }
}
</style>
