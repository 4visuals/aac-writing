<template>
  <div class="exit">
    <SpanText>끝내려면 버튼을 클릭하세요.</SpanText>
    <AacButton
      :text="`${quizText()} 종료`"
      theme="red"
      size="xs"
      fill
      @click="closeQuiz"
    />
  </div>
</template>

<script>
import { AacButton } from "@/components/form";
import { SpanText } from "@/components/text";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
export default {
  components: {
    AacButton,
    SpanText,
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const ctx = store.state.quiz.quizContext;
    const quizText = () => {
      if (ctx.isReadingMode()) {
        return "보고 쓰기";
      } else if (ctx.isLearningMode()) {
        return "학습";
      } else {
        return "퀴즈";
      }
    };
    const closeQuiz = () => {
      router.replace({
        name: ctx.prevPage,
      });
      store.commit("ui/hideReward");
      store.commit("ui/hideMenu");
      // nextTick().then(() => {

      //   store.commit("quiz/closeQuiz");
      // });
    };
    return {
      closeQuiz,
      quizText,
    };
  },
};
</script>

<style lang="scss" scoped>
.exit {
  flex: 1 1 auto;
}
</style>
