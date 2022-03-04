import store from "@/store";
import api from "@/service/api";

store.registerModule("quiz", {
  namespaced: true,
  state: () => ({
    quizContext: null,
  }),
  getters: {
    currentQuestion: (state) => state.quizContext.currentQuestion,
  },
  actions: {
    loadQuizReouces: (ctx, args) => {
      const { cateSeq, type } = args;
      api.section.sentences(cateSeq, type).then((res) => {
        // router.push(`/quiz/${props.cate.seq}`);
        console.log(res);
      });
    },
  },
  mutations: {
    setQuiz(state, args) {
      state.quizContext = args.quizContext;
    },
    setQuestion(state, index) {
      // const question = state.quizContext.questions[index];
      state.quizContext.setQuestionAt(index);
    },
  },
});

const startQuiz = (quizContext) => {
  store.commit("quiz/setQuiz", { quizContext });
};
const getQuizContext = () => store.state.quiz.quizContext;
const setQuestionAt = (index) => store.commit("quiz/setQuestion", index);
export default {
  startQuiz,
  getQuizContext,
  setQuestionAt,
};
