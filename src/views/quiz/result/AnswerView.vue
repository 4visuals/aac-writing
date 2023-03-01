<template>
  <div class="answers">
    <h3>정답 출력</h3>
    <ul>
      <li v-for="q in questions" :key="q.index">
        <ParaText>{{ q.text }}</ParaText>
      </li>
    </ul>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { ParaText } from "../../../components/text";

export default {
  setup() {
    const store = useStore();
    const ctx = store.state.quiz.quizContext;
    console.log(ctx);
    return { questions: ctx.questions };
  },
  components: { ParaText },
};
</script>

<style lang="scss" scoped>
.answers {
  flex: 1 1 auto;
  padding: 16px;
  h3 {
    font-weight: 600;
    font-size: 24px;
    margin-bottom: 16px;
  }
  ul {
    list-style: none;
    padding: 0;
    li {
      p {
        font-size: 24px;
        font-weight: 500;
        margin: 8px 0;
      }
    }
  }
}
</style>
