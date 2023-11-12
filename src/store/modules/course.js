import api from "@/service/api";
import Section from "../../entity/section";
const chapters = {
  levels: [],
  books: [],
  trials: [],
};
/**
 * section을 구성하는 문제들(낱말, 문장)에 문항 번호를 기록함.
 *
 * 기존에는 10개씩 segment단위로 퀴즈를 풀었으나,
 * 오답 다시 풀기 기능이 추가되면서 임의의 문제들만 따로 모아서 퀴즈를 제공해야 함.
 * 이러한 임의의 문제들마다 원래 section 내에서 문항 번호를 기록해야
 * 퀴즈 화면에서 현재 풀고 있는 문항 번호를 올바로 출력할 수 있음.
 *
 * @param {object} section
 */
const assignNumber = (section) => {
  // 단계별 chapter는 section마다 문장이 10개 등장한 후 나머지는 낱말로 구성됨
  // 교과서 chapter는 모든 section이 문장으로 구성됨
  // 문항 번호는 zero-based index로 기록함
  const sentences = section.sentences.filter((sen) => sen.type === "S");
  sentences.forEach((sen, index) => {
    sen.numberInSection = index;
  });
  const words = section.sentences.filter((sen) => sen.type === "W");
  words.forEach((sen, index) => {
    sen.numberInSection = index;
  });
};
const assignLevel = (chapters) => {
  chapters.forEach((chapter) => {
    chapter.sections.forEach((section, index) => {
      section.level = index + 1;
    });
  });
};
/**
 * 소개 페이지에서 사용할 체험용 section 준비
 */
const prepareTrialChapter = (chapters) => {
  const sentenceSeq = [1, 93, 163, 287, 555];
  const map = chapters
    .flatMap((chp) => chp.sections.flatMap((section) => section.sentences))
    .reduce((senMap, sentence) => {
      senMap.set(sentence.seq, sentence);
      return senMap;
    }, new Map());
  const sentences = sentenceSeq.map((seq) => map.get(seq));
  const trialSection = new Section({
    basketRef: -1,
    chapterRef: -1,
    origin: "T",
    description: " 쉬운 자음 + 쉬운 모음",
    level: 1,
    sentences,
  });
  /*
  (1단계-1) 아기 나무
  (9단계-3) 숫자를 썼다.
  (15단계-3) 개구리가 시끄럽게 개굴개굴
  (25단계-7) 귀여운 토끼가 귀를 쫑긋거렸다.
  (47단계-5) 집에 가는 길인데 아직 멀었대.
*/
  // const section = chapters[0].sections[0];
  // const trialSection = Object.assign({}, section);
  trialSection.seq = -1;
  trialSection.origin = "T";
  assignNumber(trialSection);
  trialSection.sentences = trialSection.sentences.map((sen) => {
    const copied = Object.assign({}, sen);
    copied.sectionRef = -1;
    copied.origin = "T";
    return copied;
  });
  const trialChapter = {
    desc: "가. 체험용",
    origin: "T",
    sections: [new Section(trialSection)],
  };
  trialSection.chapter = trialChapter;
  return trialChapter;
};
/**
 * section들을 linked list로 연결함
 * (퀴즈를 끝낸 후 "다음 문제"로 이동하는 기능에 필요함)
 * @param {object} chapters
 */
const assignNext = (chapters) => {
  const sections = chapters.flatMap((chapter) => chapter.sections);
  let prevSection = null;
  sections.forEach((section) => {
    if (prevSection) {
      prevSection.next = section;
    }
    prevSection = section;
  });
};
export default {
  namespaced: true,
  state: () => ({ chapters }),
  getters: {
    levels: (state) => state.chapters["levels"],
    books: (state) => state.chapters["books"],
    trials: (state) => state.chapters["trials"],
    sections: (state) => {
      const { levels, books, trials } = state.chapters;
      const courses = [...levels, ...books, ...trials];
      return courses.flatMap((chapter) => chapter.sections);
    },
    section: (_, getters) => (sectionSeq) => {
      return getters.sections.find((sec) => sec.seq === sectionSeq);
    },
    ready: (state) => state.chapters.levels.length > 0,
  },
  mutations: {
    setChapter(state, args) {
      const { data } = args;
      // 1. trial chapter - 소개 페이지 체험용
      const trialChapter = prepareTrialChapter(args.data);
      state.chapters.trials = [trialChapter];

      data.forEach((chapter) => {
        const sections = chapter.sections.map((sec) => {
          sec.origin = chapter.origin;
          // 양방향 바인딩
          sec.chapter = chapter;
          assignNumber(sec);
          return new Section(sec);
        });
        chapter.sections = sections;
      });
      state.chapters.levels = data.filter((chapter) => chapter.origin === "L");
      state.chapters.books = data.filter((chapter) => chapter.origin === "B");

      // 교과서는 level이 0
      // 위치값으로 level을 부여함
      assignLevel(state.chapters.books);
      assignNext(state.chapters.levels);
      assignNext(state.chapters.books);
    },
  },
  actions: {
    loadChapter(ctx, args) {
      api.chapter.list(args.origin).then((res) => {
        ctx.commit("setChapter", { data: res.chapters });
      });
    },
  },
};
