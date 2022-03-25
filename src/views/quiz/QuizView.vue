<template>
  <div class="quiz-wrapper">
    <template v-if="ctx">
      <Numbering />
      <div class="question">
        <component
          :is="ctx.options.questionComponent"
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
          :is="ctx.options.answerComponent"
          :quizContext="ctx"
          :question="ctx.currentQuestion"
          :fillHeight="false"
        />
      </div>
    </template>
    <div class="none" v-else>NONE</div>
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted } from "@vue/runtime-core";
import { useRoute } from "vue-router";
import quizStore from "./quizStore";
import quiz from "@/views/quiz";
import { useStore } from "vuex";
import ActionIcon from "@/components/form/ActionIcon.vue";
import Numbering from "@/views/quiz/Numbering.vue";
export default {
  components: { ActionIcon, Numbering },
  setup() {
    const store = useStore();
    const ctx = computed(() => store.state.quiz.quizContext);

    const route = useRoute();
    console.log("[QUIZ]", route.params.seq);
    quiz.loadQuiz();
    onMounted(() => {
      store.commit("ui/setBackgroundVisible", false);
      store.commit("ui/setNavSize", { expanded: false, topPadding: 56 });
    });
    onUnmounted(() => {
      store.commit("ui/setBackgroundVisible", true);
      store.commit("ui/setNavSize", { expanded: true, topPadding: 120 });
    });

    const moveQuiz = (dir) => {
      // FIXME index에 접근하는 코드, 너무 구체적임. quizStore의 메소드를 호출해서 변경하도록 수정해야함
      const index = ctx.value.currentQuestion.index + dir;
      quizStore.setQuestionAt(index);
    };
    return {
      ctx,
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
