<template>
  <div class="quiz-wrapper">
    <div class="question">
      <component
        :is="questionComponent"
        :quizContext="ctx"
        :fillHeight="true"
      />
      <ActionIcon
        v-if="ctx.currentQuestion.hasPrevQuiz()"
        class="icon left"
        icon="chevron_left"
        @click="moveQuiz(-1)"
      />
      <ActionIcon
        v-if="ctx.currentQuestion.hasNextQuiz()"
        class="icon right"
        icon="chevron_right"
        @click="moveQuiz(1)"
      />
    </div>
    <div class="answer">
      <component
        :is="answerComponent"
        :quizContext="ctx"
        :question="question"
        :fillHeight="false"
      />
    </div>
  </div>
</template>

<script>
import { onMounted, onUnmounted } from "@vue/runtime-core";
import { useRoute } from "vue-router";
import quizStore from "./quizStore";
import { useStore } from "vuex";
import ActionIcon from "@/components/form/ActionIcon.vue";
export default {
  components: { ActionIcon },
  setup() {
    const route = useRoute();
    console.log("[QUIZ]", route.params.seq);
    const quizContext = quizStore.getQuizContext();
    console.log(quizContext);
    const { questionComponent, answerComponent } = quizContext.options;
    const moveQuiz = (dir) => {
      const index = quizContext.currentQuestion.index + dir;
      quizStore.setQuestionAt(index);
    };
    const store = useStore();
    onMounted(() => {
      store.commit("ui/setBackgroundVisible", false);
    });
    onUnmounted(() => {
      store.commit("ui/setBackgroundVisible", true);
    });
    return {
      questionComponent,
      answerComponent,
      ctx: quizContext,
      question: quizContext.currentQuestion,
      moveQuiz,
    };
  },
};
</script>

<style lang="scss" scoped>
.quiz-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  .question {
    flex: 3 3;
    display: flex;
    flex-direction: column;
    position: relative;
    .icon {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      font-size: 3rem;
      z-index: 5;
      &.left {
        left: 20px;
      }
      &.right {
        right: 20px;
      }
    }
  }
  .answer {
    flex: 0 1 auto;
    display: flex;
    // padding: 16px;
    justify-content: center;
    // overflow-x: auto;
  }
}
</style>
