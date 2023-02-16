<template>
  <ScoreUI
    v-if="scoreVisible"
    :score="scoring.getScore()"
    @view-answer="scoreVisible = false"
  />
  <WordExamResult
    v-else
    :scoring="scoring"
    :resourceType="ctx.resourceType"
    @show-score="scoreVisible = true"
  />
</template>

<script>
import { useStore } from "vuex";
import WordExamResult from "./WordExamResult.vue";
import Scoring from "./scoring";
import { ref } from "vue";
import ScoreUI from "./ScoreUI.vue";

export default {
  setup() {
    const scoreVisible = ref(true);
    const store = useStore();
    const ctx = store.state.quiz.quizContext;
    const scoring = new Scoring(ctx);
    return { scoreVisible, ctx, scoring };
  },
  components: { WordExamResult, ScoreUI },
};
</script>

<style lang="scss" scoped></style>
