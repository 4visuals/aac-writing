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
  W: (sen) => sen.eojeols.length === 1,
  A: () => true,
};
/**
 * 퀴즈 질문과 학생이 입력한 답안을 기록
 */
class Question {
  constructor(quizConfig, index, sentence) {
    this.config = quizConfig;
    this.solved = false;
    /**
     * 문제 순서
     */
    this.index = index;
    /**
     * 질문 리소스(문장 단어 등)
     */
    this.data = sentence;
    /**
     * 답변 리소스. 정답이 가장 마지막 element에 해당함
     */
    this.trials = [];
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
  isWord() {
    return this.data.type === "W";
  }
  isSentence() {
    return this.data.type === "S";
  }
  addTrial(value, elapsedTimeMillis) {
    // 사용자가 입력한 값
    const correct = this.text === value;
    this.trials.push({
      sentenceRef: this.data.seq,
      correct,
      value,
      elapsedTimeMillis,
    });
    this.solved = correct;
    return correct;
  }
  get text() {
    return this.data.sentence.trim();
  }
  get eojeols() {
    return this.data.eojeols;
  }
}
class QuizConfig {
  /**
   *
   * @param {Array[sentence]} resources
   * @param {{
          quizMode,
          answerType,
          section,
          quizResource,
        }} options
   */
  constructor(resources, options) {
    this.resources = resources;
    this.options = options;
  }
  get quizLength() {
    return this.resources.length;
  }
}
/**
  [OPTIONS]
  ### questionComponent:VueComponent
  질문을 렌더링하는 컴포넌트
  
  ### answerCompoent:VueComponent
  사용자가 정답을 입력하는 컴포넌트
  
  ### symbolConfig.pumsa
  문장 학습에서 어절의 품사를 그리는 방식
  * 'follow' - 어절의 품사 타입(what, who 등)에 맞는 그림을 선택
  * 기타 - 'what', 'who'등 지정한 그림을 선택

  ### mode:string('LEARNGING', 'QUIZ')

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
   * @param {{questionComponent, answerCompoent, symbolConfig, maxTrials, autoSlide, rewardForCorrect, rewardForWrong, config}} options
   */
  constructor(config, questions, options) {
    this.config = config;
    this.questions = questions;
    this.options = options;
    this.setQuestionAt(0);
    this.startTime = new Date().getTime();
  }
  get quizLength() {
    return this.questions.length;
  }
  get rememberAnswer() {
    return this.options.rememberAnswer;
  }
  get pumsaType() {
    return this.options.symbolConfig.pumsa;
  }
  get license() {
    return this.options.license;
  }
  get sectionSeq() {
    return this.config.options.section.seq;
  }
  get section() {
    return this.config.options.section;
  }
  get prevPage() {
    return this.config.options.prevPage;
  }
  get mode() {
    return this.options.mode;
  }
  get resourceType() {
    return this.config.options.quizResource;
  }
  /**
   * 낱말읽기, 문장읽기
   * @returns boolean
   */
  isReadingMode() {
    return this.options.mode === "READING";
  }
  /**
   * 낱말 받아쓰기, 낱말 학습, 문장 받아쓰기, 문장학습 모두
   * @returns boolean
   */
  isLearningMode() {
    // https://github.com/4visuals/aac-writing/issues/27
    // 받아쓰기('READING')를 [그림한글/문장/장면과 문장 보고쓰기]로 교체함
    // 맞거나 틀리면 보상 그림이 나오도록 바뀜
    // 받아쓰기 모드는 이제 의미가 없음
    return this.options.mode !== "QUIZ";
  }
  /**
   * 낱말퀴즈, 문장퀴즈
   * @returns boolean
   */
  isQuizMode() {
    return this.options.mode === "QUIZ";
  }
  isWord() {
    return this.config.options.quizResource === "W";
  }
  isSentence() {
    // sentence(S) or all(A)인 경우
    return this.config.options.quizResource !== "W";
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
 * quizMode - 받아쓰기('READING'), 학습('LEARNING') OR 테스트('QUIZ') 모드
 * answerType -  정답 입력 컴포넌트 종류. 어절 선택('EJ') or 받아쓰기('SEN')
 * section - secion seq
 * quizResource - 'S(sentence)' or 'W(word)' or 'A(all)'
 * license - 퀴즈 결과를 저장할 수강증 SEQ
 *
 * @param {{quizMode,  answerType, section, quizResource, license, prevPage }} quiz 옵션
 */
const loadSentenceQuiz = ({
  quizMode,
  answerType,
  section,
  quizResource,
  prevPage,
}) => {
  const questionComponent = shallowRef(ScenePicView);
  const answerCompName =
    typeof answerType === "string" ? answerType : answerType.comp;
  const answerComponent = answerComponents.get(answerCompName);
  const symbolConfig = {
    pumsa: typeof answerType === "string" ? "follow" : answerType.pumsa,
  };
  const license = store.getters["exam/activeLicense"];

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
        const config = new QuizConfig(sentences, {
          quizMode,
          answerType,
          section: sec,
          quizResource,
          prevPage,
        });
        const questions = sentences.map(
          (sen, index) => new Question(config, index, sen)
        );

        const ctx = new QuizContext(config, questions, {
          questionComponent,
          answerComponent,
          symbolConfig,
          mode: quizMode,
          maxTrials: quizMode === "LEARNING" ? -1 : 0,
          autoSlide: false,
          rewardForCorrect: quizMode === "LEARNING",
          rewardForWrong: quizMode === "LEARNING",
          rememberAnswer: true,
          license,
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
const prepareQuiz = ({
  quizMode,
  answerType,
  section,
  quizResource,
  license,
  prevPage,
}) => {
  const sections = store.getters["course/sections"];
  const sec = sections.find((sec) => sec.seq === section);
  return new Promise((resolve, reject) => {
    if (!sec) {
      reject("NO_SECTION");
      return;
    }
    const senFilter = sentenceFilters[quizResource];
    const sentences = sec.sentences.filter(senFilter);
    if (sentences.length === 0) {
      reject({ cause: "NO_QUIZ", resource: quizResource });
      return;
    }
    storage.session.write("quizSpec", {
      quizMode,
      answerType,
      section,
      quizResource,
      license,
      prevPage,
    });
    resolve();
  });
};
export { Question, QuizContext, QuizView };
export default {
  loadSentenceQuiz,
  prepareQuiz,
  loadQuiz,
};
