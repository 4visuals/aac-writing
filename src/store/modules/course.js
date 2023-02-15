import api from "@/service/api";
const chapters = {
  levels: [],
  books: [],
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
