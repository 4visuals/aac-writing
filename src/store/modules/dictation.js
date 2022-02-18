class Cate {
  /**
   *
   * @param {int} seq PK
   * @param {string} title title
   * @param {string} subTitle
   * @param {string} description
   * @param {string} type 단계별 학습에서는 [quiz|test], 교과서 학습에서는 [sem|chapter]
   */
  constructor(seq, title, subTitle, description, type) {
    this.seq = seq;
    this.title = title;
    this.subTitle = subTitle;
    this.description = description;
    this.type = type;
    this.subs = [];
  }
}
const bookCates = [
  {
    seq: 200,
    title: "1학년 1학기",
    desc: "",
    chapters: [
      { seq: 201, title: "1단원", desc: "1단원 설명" },
      { seq: 202, title: "2단원", desc: "2단원 설명" },
      { seq: 203, title: "3단원", desc: "4단원 설명" },
      { seq: 204, title: "4단원", desc: "4단원 설명" },
      { seq: 205, title: "5단원", desc: "5단원 설명" },
      { seq: 206, title: "6단원", desc: "6단원 설명" },
    ],
  },
  {
    seq: 300,
    title: "1학년 2학기",
    desc: "",
    chapters: [
      { seq: 301, title: "1단원", desc: "1단원 설명" },
      { seq: 302, title: "2단원", desc: "2단원 설명" },
      { seq: 303, title: "3단원", desc: "4단원 설명" },
      { seq: 304, title: "4단원", desc: "4단원 설명" },
      { seq: 305, title: "5단원", desc: "5단원 설명" },
      { seq: 306, title: "6단원", desc: "6단원 설명" },
    ],
  },
];

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

const book = buildTree(bookCates, 0, bookToCate);
const cates = {
  level: [
    {
      quiz: [
        new Cate(10, "1단계", "받침 없는 글자", "받침 없는", "quiz"),
        new Cate(11, "2단계", "받침 ㅇㄹㅁ", "받침 없는 글자 테스트", "quiz"),
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
  ],
  book,
};

export default {
  state: () => ({ cates }),
};
