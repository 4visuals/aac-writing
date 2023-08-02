<template>
  <div class="abs-center q-nav">
    <ParaText class="h" :class="[theme.name]">
      {{ ctx.getModeText() }} 완료!</ParaText
    >
    <ParaText
      >{{ ctx.section.getLevelText() }} 단계 {{ ctx.resourceText }}
      {{ ctx.getRangeText() }} 완료</ParaText
    >
    <Transition name="trs-scales" mode="out-in" appear>
      <div class="btns">
        <AppButton
          size="nav"
          :theme="theme.name"
          text="다시하기"
          @click="quizProvider.retry()"
        />
        <AppButton
          size="nav"
          :theme="theme.name"
          text="다음단계"
          @click="quizProvider.startNext"
        />
        <AppButton
          size="nav"
          :theme="theme.name"
          text="학습선택"
          @click="quizProvider.gotoSection"
        />
        <AppButton
          size="nav"
          :theme="theme.name"
          text="학습종료"
          @click="quizProvider.gotoChapter"
        />
      </div>
    </Transition>
  </div>
</template>

<script>
import { inject } from "vue";
import { useStore } from "vuex";
import { ParaText } from "../../../components/text";

export default {
  setup() {
    const store = useStore();
    const ctx = store.state.quiz.quizContext;
    const theme = store.state.ui.theme;
    const quizProvider = inject("quizProvider");

    const showAlert = (msg) => alert(msg);
    return { ctx, theme, quizProvider, showAlert };
  },
  components: { ParaText },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
.q-nav {
  display: flex;
  flex-direction: column;
  row-gap: 32px;
  @include mobile {
    position: relative;
    top: 0;
    left: 0;
    transform: translate(0, 0);
    margin: 0 auto;
    padding-top: 32px;
  }
  p {
    text-align: center;
    &.h {
      font-weight: 600;
      font-size: 24px;
      &.blue {
        color: #4b7bec;
      }
      &.brown {
        color: #865900;
      }
    }
  }

  .btns {
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
    position: relative;
  }
}
</style>
