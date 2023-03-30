import { quizDao } from "../../dao";
import store from "@/store";
import api from "@/service/api";
import { logger } from "@/service/util";
import { RetryMode } from "../../components/quiz/retry-mode";

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
    /**
     * 힌트
     */
    hint: {
      visible: false,
      cnt: 0, // 현재 문제에서 연속으로 틀릿 횟수
      text: null,
    },
    /**
     * 장면 클릭
     */
    sceneClick: 0,
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
    saveQuiz: (ctx) => {
      const { state } = ctx;
      if (state.finished) {
        return quizDao.saveQuiz(state.quizContext);
      } else {
        return Promise.resolve();
      }
    },
    closeQuiz({ state }) {
      // if (state.finished) {
      //   // 현재 퀴즈를 다 풀었음. db에서 삭제
      //   quizDao.deleteQuiz(state.quizContext);
      // } else {
      //   // 중간에 그만둠. 상태 저장
      // }
      // 무조건 저장
      /**
       * 아니라고 함. 뭔지 모르겠다.
       * https://github.com/4visuals/aac-writing/issues/123
       */
      const { retryMode, failedOnly } = state.quizContext;
      if (retryMode === RetryMode.FAILED || failedOnly) {
        // 오답 연습이거나 틀린 문제 다시 풀기는 브라우저 디비에 기록하지 않음.
        state.finished = false;
        state.quizContext = null;
        return Promise.resolve();
      } else {
        return quizDao.saveQuiz(state.quizContext).then(() => {
          state.finished = false;
          state.quizContext = null;
        });
      }
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

    showHint(state, args) {
      const { text, cnt } = args;
      state.hint.visible = cnt >= 2;
      state.hint.cnt = cnt;
      state.hint.text = text;
    },
    hideHint(state) {
      state.hint.visible = false;
      state.hint.cnt = 0;
      state.hint.level = state.hint.text = null;
    },
    sceneClicked(state) {
      state.sceneClick = new Date().getTime();
    },
    /**
     * 현재 퀴즈 상태를 db에 저장함
     * @param {VuexState} state
     */
    syncQuiz(state) {
      console.log(state);
      quizDao.saveQuiz(state.quizContext);
    },
  },
});

const startQuiz = (quizContext) => {
  store.commit("quiz/hideResultView");
  store.commit("quiz/setQuiz", { quizContext });
};
const getQuizContext = () => store.state.quiz.quizContext;
const setQuestionAt = (index) => {
  store.commit("quiz/setQuestion", index);
  store.commit("quiz/hideHint");
};
const shiftBy = (offset) => {
  const ctx = store.state.quiz.quizContext;
  const nextQuizIndex = ctx.currentQuestion.index + offset;
  logger.log("[Q:NEXT IDX]", nextQuizIndex);
  if (nextQuizIndex === ctx.quizLength) {
    store.commit("quiz/showResultView");
  } else if (nextQuizIndex < 0) {
    alert("no more quiz");
  } else {
    setQuestionAt(nextQuizIndex);
  }
};
export default {
  startQuiz,
  getQuizContext,
  setQuestionAt,
  moveNext: () => shiftBy(1),
  movePrev: () => shiftBy(-1),
};
