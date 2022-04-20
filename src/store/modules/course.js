import api from "@/service/api";

// const levelToCate = (elem, level) => {
//   const sub = elem.desc;
// }
/*
const bookToCate = (elem, level) => {
  const sub = elem.desc;
  const type = level === 0 ? "sem" : "chapter";
  const cate = new Cate(elem.seq, elem.title, sub, "", type);
  const chapters = elem.chapters || [];
  cate.subs = chapters.map((chapter) => bookToCate(chapter, level + 1));
  return cate;
};

const buildTree = (elems, level, fn) => {
  const cates = [];
  elems.forEach((elem) => {
    const child = fn(elem, level);
    cates.push(child);
  });
  return cates;
};
*/
// const level = buildTree(levelCates, 0, levelToCate);
// const books = buildTree(bookCates, 0, bookToCate);
const chapters = {
  levels: [
    /*
    {
      quiz: [
        new Cate(10, "1단계", "받침 없는 글자", "받침 없는 글자 연습", "quiz"),
        new Cate(11, "2단계", "받침 ㅇㄹㅁ", "ㅇㄹㅁ을 연습합니다.", "quiz"),
        new Cate(12, "3단계", "받침 ㄱㅇㅂ", "받침 없는 글자 테스트", "quiz"),
        new Cate(13, "4단계", "받침 ㄴㅅㅆ", "받침 없는 글자 테스트", "quiz"),
      ],
      test: [new Cate(14, "평가", "1~4단계", "받침 없는 글자 테스트", "test")],
    },
    {
      quiz: [
        new Cate(15, "1단계", "받침 없는 글자", "받침 없는", "quiz"),
        new Cate(16, "2단계", "받침 ㅇㄹㅁ", "받침 없는 글자 테스트", "quiz"),
        new Cate(17, "3단계", "받침 ㄱㅇㅂ", "받침 없는 글자 테스트", "quiz"),
        new Cate(18, "4단계", "받침 ㄴㅅㅆ", "받침 없는 글자 테스트", "quiz"),
      ],
      test: [new Cate(19, "평가", "1~4단계", "받침 없는 글자 테스트", "test")],
    },
    */
  ],
  books: [],
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
  },
  mutations: {
    setChapter(state, args) {
      const { data } = args;
      state.chapters.levels = data.filter((chapter) => chapter.origin === "L");
      state.chapters.books = data.filter((chapter) => chapter.origin === "B");
    },
  },
  actions: {
    loadChapter(ctx, args) {
      api.chapter.list(args.origin).then((res) => {
        ctx.commit("setChapter", { prop: "levels", data: res.chapters });
      });
    },
  },
};
