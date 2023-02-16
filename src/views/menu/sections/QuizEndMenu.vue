<template>
  <div class="exit">
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
import { useStore } from "vuex";
import { useRouter } from "vue-router";
export default {
  components: {
    AacButton,
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const ctx = store.state.quiz.quizContext;
    const quizText = () => {
      if (ctx.isReadingMode()) {
        return "보고 쓰기";
      } else if (ctx.isLearningMode()) {
        return "연습하기";
      } else {
        return "받아쓰기";
      }
    };
    const closeQuiz = () => {
      router.replace({
        name: ctx.getMainPath(),
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
