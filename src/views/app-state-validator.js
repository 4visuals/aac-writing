import { useStore } from "vuex";
/**
 * local storage에 저장된 license가 없어질 수가 있나..
 *
 * @param {router: Router} args
 */
const checkAppState = ({ router }) => {
  const store = useStore();
  store.dispatch("exam/loadLicense").then((license) => {
    if (!license) {
      router.replace({ path: "/" });
    }
  });
};

const loadStudentRecords = ({ store, license }) => {
  if (license) {
    return store.dispatch("record/prefetch", license.studentRef);
  } else {
    return Promise.resolve();
  }
};

const findActiveChapter = ({ store, chapters }) => {
  const seq = store.getters["ui/activeChapter"]("level");
  const chapter = chapters.find((chapter) => chapter.seq === seq);
  return chapter;
};
const resolvePerfectChapters = ({ chapters, sectionRecordMap }) => {
  if (sectionRecordMap.size === 0 || !chapters || chapters.length === 0) {
    return;
  }
  const target = {};
  chapters.map((chapter) => {
    const cnt = { word: 0, sen: 0 };
    const { sections } = chapter;
    for (let k = 0; k < sections.length; k++) {
      const sec = sections[k];
      cnt.word += sec.countWords();
      cnt.sen += sec.countSentences();
      const sectionRecord = sectionRecordMap.get(sec.seq);
      if (sectionRecord?.records) {
        cnt.word -= sectionRecord.records
          .filter((record) => record.type === "W")
          .reduce((sum, record) => sum + record.numOfCorrectAnswer, 0);
        cnt.sen -= sectionRecord.records
          .filter((record) => record.type === "S")
          .reduce((sum, record) => sum + record.numOfCorrectAnswer, 0);
      }
    }

    target[chapter.seq] = {
      mod: 1,
      word: cnt.word === 0,
      sen: cnt.sen === 0,
    };
    target.mod = 1;
  });

  return target;
};

const isPerfectChapter = (chapter, perfect, prop) => {
  if (!perfect) {
    return;
  }
  return perfect[chapter.seq][prop];
};

const listingViewHelper = () => {
  return {
    findActiveChapter,
    resolvePerfectChapters,
    isPerfectChapter,
  };
};

export { checkAppState, loadStudentRecords, listingViewHelper };
