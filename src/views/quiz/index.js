import QuizView from "./QuizView.vue";
import quizStore from "./quizStore";
import ScenePicView from "./question/ScenePicView.vue";
import EojelInput from "./answer/EojelInput.vue";
import SentenceInput from "./answer/SentenceInput.vue";
import { shallowRef, watch } from "vue";
// import api from "@/service/api";
import store from "@/store";
import storage from "@/service/storage";

const answerComponents = new Map();
answerComponents.set("EJ", shallowRef(EojelInput));
answerComponents.set("SEN", shallowRef(SentenceInput));
/**
 * 주어진 질문(Sentence에서 문장 또는 단어를 필터링함
 * 어절이 1개이면 단어 질문으로 판정함
 */
const sentenceFilters = {
  S: (sen) => sen.eojeols.length > 1,
  W: (sen) => sen.eojeols.length === 0,
  A: () => true,
};
/**
 * 퀴즈 질문
 */
class Question {
  constructor(quizConfig, index, question) {
    this.config = quizConfig;
    this.solved = false;
    /**
     * 문제 순서
     */
    this.index = index;
    /**
     * 질문 리소스(문장 단어 등)
     */
    this.data = question;
    /**
     * 답변 리소스. 정답이 가장 마지막 element에 해당함
     */
    this.responses = [];
    this.data.eojeols.forEach((ej) => {
      // trials: 시도한 입력들
      // solved: 풀었는지를 나타냄
      ej.trials = [];
      ej.solved = false;
    });
  }
  /**
   * 맞는 정답인지 확인함
   * @param {Object} answer
   * @returns
   */
  isCorrect(answer) {
    console.log("[answer]", answer);
    return false;
  }
  hasPrevQuiz() {
    return !this.isFirst();
  }
  hasNextQuiz() {
    return !this.isLast();
  }
  isFirst() {
    return this.index === 0;
  }
  isLast() {
    return this.index + 1 === this.config.quizLength;
  }
  get text() {
    return this.data.sentence.trim();
  }
}
class QuizConfig {
  constructor(resources) {
    this.resources = resources;
  }
  get quizLength() {
    return this.resources.length;
  }
}
/**
 * new QuizContext(questions, {
      questionComponent,
      answerComponent,
      answerType,
      maxTrials: quizMode === "LEARNING" ? -1 : 0,
      autoSlide: false,
      showPenguin: quizMode === "LEARNING",
    });
  
    [OPTIONS]
  ### questionComponent:VueComponent
  질문을 렌더링하는 컴포넌트
  
  ### answerCompoent:VueComponent
  사용자가 정답을 입력하는 컴포넌트
  
  ### symbolConfig.pumsa
  문장 학습에서 어절의 품사를 그리는 방식
  * 'follow' - 어절의 품사 타입(what, who 등)에 맞는 그림을 선택
  * 기타 - 'what', 'who'등 지정한 그림을 선택

  ### maxTrials:int(-1, 0, positive)
  정답을 입력할때까지 시도할 수 있는 횟수.
  -1이면 정답을 입력할때까지 계속 시도해야 함.
  0이면 정답 오답 확인없이 다음 문제로 넘어감(시험모드)
  
  ### autoSlide:boolean
  입력 완료 후 다음 문제로 자동으로 넘어가는 옵션. false이면 사용자가 클릭해서 문제를 넘겨야 함

  ### rewardForCorrect:boolean
  문제마다 정답을 맞췄을때 제공되는 이미지

  ### rewardForWrong:boolean
  문제마다 틀렸을때 보상으로 제공되는 이미지

  ### rememberAnswer:boolean(default false)
  문제를 앞뒤로 이동할때 이전에 입력한 답을 유지할 것인지. true이면 유지함. false이면 초기화함.
 */
class QuizContext {
  /**
   *
   * @param {[Question]} questions
   * @param {{questionComponent, answerCompoent, symbolConfig, maxTrials, autoSlide, rewardForCorrect, rewardForWrong}} options
   */
  constructor(questions, options) {
    this.questions = questions;
    this.options = options;
    this.setQuestionAt(0);
  }
  get rememberAnswer() {
    return this.options.rememberAnswer;
  }
  get pumsaType() {
    return this.options.symbolConfig.pumsa;
  }
  // get currentQuestion() {
  //   return this.currentQuestion;
  // }
  setQuestionAt(idx) {
    this._currentIndex = idx;
    this.currentQuestion = this.questions[this._currentIndex];
  }
}
/**
 * quizMode - 학습('LEARNING') OR 테스트('QUIZ') 모드
 * answerType -  정답 입력 컴포넌트 종류. 어절 선택('EJ') or 받아쓰기('SEN')
 * section - secion seq
 * quizResource - 'S(sentence)' or 'W(word)' or 'A(all)'
 *
 * @param {{quizMode,  answerType, section, quizResource }} quiz 옵션
 */
const loadSentenceQuiz = ({ quizMode, answerType, section, quizResource }) => {
  const questionComponent = shallowRef(ScenePicView);
  const answerCompName =
    typeof answerType === "string" ? answerType : answerType.comp;
  const answerComponent = answerComponents.get(answerCompName);
  const symbolConfig = {
    pumsa: typeof answerType === "string" ? "follow" : answerType.pumsa,
  };

  return new Promise((resolve) => {
    watch(
      () => store.getters["course/sections"],
      (sections) => {
        const sec = sections.find((sec) => sec.seq === section);
        if (!sec) {
          return;
        }
        /*
         * 문장 또는 단어만 필터링하는 함수
         * 단계별 학습에서는 [단어, 문장]을 따로 구분함,
         * 교과서 학습에서는 단어가 따로 없고 모두 문장으로 처리함
         */
        const senFilter = sentenceFilters[quizResource];
        const sentences = sec.sentences.filter(senFilter);
        const config = new QuizConfig(sentences);
        const questions = sentences.map(
          (sen, index) => new Question(config, index, sen)
        );

        const ctx = new QuizContext(questions, {
          questionComponent,
          answerComponent,
          symbolConfig,
          maxTrials: quizMode === "LEARNING" ? -1 : 0,
          autoSlide: false,
          rewardForCorrect: quizMode === "LEARNING",
          rewardForWrong: quizMode === "LEARNING",
          rememberAnswer: true,
        });
        quizStore.startQuiz(ctx);
        resolve(ctx);
      },
      {
        immediate: true,
      }
    );
  });

  /*
  return api.section.sentences(section, quizResource).then((res) => {
    const config = new QuizConfig(res.sentences);
    const questions = res.sentences.map(
      (sen, index) => new Question(config, index, sen)
    );

    const ctx = new QuizContext(questions, {
      questionComponent,
      answerComponent,
      maxTrials: quizMode === "LEARNING" ? -1 : 0,
      autoSlide: false,
      rewardForCorrect: quizMode === "LEARNING",
      rewardForWrong: quizMode === "LEARNING",
      rememberAnswer: true,
    });
    quizStore.startQuiz(ctx);
    return ctx;
  });
  */
};
const loadQuiz = () => {
  const quizSpec = storage.session.read("quizSpec");
  return loadSentenceQuiz(quizSpec);
};
const prepareQuiz = ({ quizMode, answerType, section, quizResource }) => {
  storage.session.write("quizSpec", {
    quizMode,
    answerType,
    section,
    quizResource,
  });
};
export { Question, QuizContext, QuizView };
export default {
  loadSentenceQuiz,
  prepareQuiz,
  loadQuiz,
};
