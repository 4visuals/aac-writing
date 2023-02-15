/**
 * @module quiz
 */
import { quizDao } from "../../dao";
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

const colors = [
  ["#f3a600", "#ffd57c"],
  ["#00acc2", "#95d7e0"],
  ["#c2ac88", "#e2d2b7"],
  ["#5e97f6", "#b9d3fe"],
  ["#db4537", "#ffbcb6"],
  ["#0e9d59", "#a1e0c2"],
  ["#444444", "#c6c6c6"],
];
/**
 * 20 ~ 60개 크기의 section을 10개씩 나눠서 segment로 나타냄.
 * 5단계 낱말의 경우 문제가 60개. 총 6개의 segment + 전체1 => 7 segments
 */
class Segment {
  constructor(index, offset, size, label, colors, sentences, ranges) {
    this.index = index;
    this.offset = offset;
    this.size = size;
    this.label = label;
    this.colors = [...colors];
    this.sentences = sentences;

    const [start, end] = ranges;
    // 현재 풀고 있는 segment인지 나타냄
    this.current = offset === start && size === end - start;
  }
  get mainColor() {
    return this.colors[0];
  }
  get subColor() {
    return this.colors[1];
  }
  get start() {
    return this.offset;
  }
  get end() {
    return this.offset + this.size;
  }
  getSentences() {
    const { start, end } = this;
    return this.sentences.slice(start, end);
  }
}

Segment.createSegments = (section, resourceType) => {
  let type = resourceType === "A" ? "S" : resourceType;
  // const section = this.section;
  const sentences = section.sentences.filter((sen) => sen.type === type);
  const segments = [...Array(sentences.length / 10).keys()].map((index) => {
    const label = `${index * 10 + 1}-${index * 10 + 10}`;
    return new Segment(
      index,
      10 * index,
      10,
      label,
      colors[index],
      sentences,
      [0, 0] // 현재 문제를 푸는 상태가 아니므로 의미없는 범위를 지정함
    );
  });
  return segments;
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
     * 답변 리소스.
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
  /**
   * section내에서의 index. 첫번째 문제는 0
   */
  get offsetInSection() {
    return this.config.options.ranges[0] + this.index;
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
          ranges
        }} options
   */
  constructor(resources, options) {
    this.resources = resources;
    this.options = options;
  }
  get quizLength() {
    return this.resources.length;
  }
  get ranges() {
    return this.options.ranges;
  }
  get section() {
    return this.options.section;
  }
  get answerType() {
    return this.options.answerType;
  }
}

const resourceTextMap = {
  W: "낱말",
  S: "문장",
  A: "교과서",
};
const modeTextMap = {
  READING: "보고쓰기",
  LEARNING: "연습하기",
  QUIZ: "받아쓰기",
};
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

  @module quiz/QuizContext
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
  /**
   * @return 'W', 'S', or 'A'
   */
  get resourceType() {
    return this.config.options.quizResource;
  }
  /**
   * 낱말(W), 문장(S), 교과서(A) 반환
   */
  get resourceText() {
    const rssType = this.resourceType;
    return resourceTextMap[rssType];
  }
  get ranges() {
    return this.config.ranges;
  }
  /**
   * "1 ~ 10", "31 ~ 40"과 같은 범위를 텍스트료 반환함
   *
   * @param {string} delim
   * @returns 문제의 범위를 나타내는 텍스트 형식
   */
  getRangeText(delim = " ~ ") {
    let [start, end] = this.ranges;
    start += 1;
    return `${start < 10 ? "0" + start : start}${delim}${end}`;
  }
  /**
   * 보고쓰기('READING'), 연습하기('LEARNING'), 받아쓰기('QUIZ')
   * @returns
   */
  getModeText() {
    return modeTextMap[this.mode] || `[${this.mode}]`;
  }
  /**
   * 단계별 문제인지 나타냄
   * @returns
   */
  isLevelQuiz() {
    return this.section.origin === "L";
  }
  /**
   * 교과서의 문제인지 나타냄
   * @returns
   */
  isBookQuiz() {
    return this.section.origin === "B";
  }
  /**
   * 보고쓰기, 문장읽기
   * @returns boolean
   */
  isReadingMode() {
    return this.options.mode === "READING";
  }
  /**
   * 낱말 보고쓰기, 낱말 학습, 문장 보고쓰기, 문장학습 모두
   * @returns boolean
   */
  isLearningMode() {
    // https://github.com/4visuals/aac-writing/issues/27
    // 보고쓰기('READING')를 [그림한글/문장/장면과 문장 보고쓰기]로 교체함
    // 맞거나 틀리면 보상 그림이 나오도록 바뀜
    // 보고쓰기 모드는 이제 의미가 없음
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
  /**
   * 문제 형식이 sentence(S) or all(A)인 경우.
   * 교과서의 모든 문제들도 문장들이지만 단계별 학습의 문장들과 구분하기 위해, S가 아닌 A로 입력되어 있음.
   * @returns
   */
  isSentence() {
    return this.config.options.quizResource !== "W";
  }
  // get currentQuestion() {
  //   return this.currentQuestion;
  // }
  setQuestionAt(idx) {
    this._currentIndex = idx;
    this.currentQuestion = this.questions[this._currentIndex];
  }
  syncDb() {
    quizDao.sync(this).then((res) => {
      console.log(res);
    });
  }
  getSegments(resourceType) {
    let type = resourceType || this.resourceType;
    return Segment.createSegments(this.section, type);
  }
  /**
   * 단게별 문제와 달리 교과서 문제인 경우 A로 입력되어 있음.
   * 문항의 타입은 문장입니다.
   * @returns 'W' | 'S'
   */
  getQuestionType() {
    const type = this.resourceType;
    return type === "A" ? "S" : type;
  }
}
/**
 * quizMode - 보고쓰기('READING'), 학습('LEARNING') OR 테스트('QUIZ') 모드
 * answerType -  정답 입력 컴포넌트 종류. 어절 선택('EJ') or 받아쓰기('SEN')
 * section - secion seq
 * quizResource - 'S(sentence)' or 'W(word)' or 'A(all)'
 * license - 퀴즈 결과를 저장할 수강증 SEQ
 *
 * @param {{quizMode,  answerType, section, quizResource, prevPage, seqs, license, prevPage }} quiz 옵션
 */
const loadSentenceQuiz = ({
  quizMode,
  answerType,
  section,
  quizResource,
  prevPage,
  seqs, // list of sentence seq
  ranges,
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
         * 선택한 문장들만 골라냄
         */
        const sentences = seqs.map((seq) =>
          sec.sentences.find((sen) => sen.seq === seq)
        );
        const config = new QuizConfig(sentences, {
          quizMode,
          answerType,
          section: sec,
          quizResource,
          prevPage,
          ranges,
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
        ctx.syncDb();
        quizStore.startQuiz(ctx);
        resolve(ctx);
      },
      {
        immediate: true,
      }
    );
  });
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
  sentenceFilter,
  ranges,
}) => {
  const sections = store.getters["course/sections"];
  const sec = sections.find((sec) => sec.seq === section);
  return new Promise((resolve, reject) => {
    if (!sec) {
      reject("NO_SECTION");
      return;
    }
    // const senFilter = sentenceFilters[quizResource];
    const sentences = sentenceFilter(sec.sentences);
    if (sentences.length === 0) {
      reject({ cause: "NO_QUIZ", resource: quizResource });
      return;
    }
    const seqs = sentences.map((sen) => sen.seq);
    storage.session.write("quizSpec", {
      quizMode,
      answerType,
      section,
      quizResource,
      license,
      prevPage,
      seqs, // list of sentence seq
      ranges, // [startOffset, endOffset) in a section
    });
    resolve();
  });
};
export { Segment, Question, QuizContext, QuizView };
export default {
  loadSentenceQuiz,
  prepareQuiz,
  loadQuiz,
};
