import store from "@/store";
import api from "@/service/api";

store.registerModule("quiz", {
  namespaced: true,
  state: () => ({
    /**
     * 퀴즈 종료 여부를 나타냄. true이면 결과 화면을 보여줌
     */
    finished: false,
    /**
     * 현재 풀고 있는 퀴즈 정보
     */
    quizContext: null,
  }),
  getters: {
    quizPage: (state) => !!state.quizContext, // 퀴즈화면인지 나타냄
    currentSection: (state) => state.quizContext && state.quizContext.section,
    currentPara: (state) =>
      state.quizContext ? state.quizContext.currentQuestion : null,
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
    showResultView(state) {
      state.finished = true;
    },
    hideResultView(state) {
      state.finished = false;
    },
    closeQuiz(state) {
      state.finished = false;
      state.quizContext = null;
    },
  },
});

const startQuiz = (quizContext) => {
  store.commit("quiz/setQuiz", { quizContext });
};
const getQuizContext = () => store.state.quiz.quizContext;
const setQuestionAt = (index) => store.commit("quiz/setQuestion", index);
const shiftBy = (offset) => {
  const ctx = store.state.quiz.quizContext;
  const nextQuizIndex = ctx.currentQuestion.index + offset;
  if (nextQuizIndex === ctx.quizLength) {
    store.commit("quiz/showResultView");
  } else if (ctx.currentQuestion.hasNextQuiz()) {
    setQuestionAt(ctx.currentQuestion.index + offset);
  } else {
    alert("no more quiz");
  }
};
export default {
  startQuiz,
  getQuizContext,
  setQuestionAt,
  moveNext: () => shiftBy(1),
  movePrev: () => shiftBy(-1),
};
