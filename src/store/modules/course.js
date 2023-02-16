import api from "@/service/api";
const chapters = {
  levels: [],
  books: [],
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
    sections: (state) => {
      const courses = [...state.chapters.levels, ...state.chapters.books];
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
      data.forEach((chapter) => {
        chapter.sections.forEach((sec) => {
          sec.origin = chapter.origin;
          // 양방향 바인딩
          sec.chapter = chapter;
          assignNumber(sec);
        });
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
