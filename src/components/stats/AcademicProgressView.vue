<template>
  <div class="progress-view">
    <ModalHeader
      ><ActionIcon icon="arrow_back" @click="$emit('close')"></ActionIcon
      ><SpanText>학습 결과</SpanText>
      <div class="ctrls">
        <button
          :class="{
            active: menu === activeMenu,
            daily: menu.daily,
            level: menu.level,
            book: menu.book,
          }"
          v-for="menu in menus"
          :key="menu.cmd"
          @click="switchView(menu)"
        >
          {{ menu.text }}
        </button>
      </div></ModalHeader
    >
    <DailyStatView v-if="activeMenu.cmd === 'daily'" />
    <CourseStatView
      v-else-if="activeMenu.cmd === 'level'"
      origin="L"
      :exams="exams"
      :courseStat="chapterStats.level"
    />
    <CourseStatView
      v-else-if="activeMenu.cmd === 'book'"
      origin="B"
      :exams="exams"
      :courseStat="chapterStats.book"
    />
  </div>
</template>

<script>
import ChapterSummary from "./chapter-summary";
import { ActionIcon } from "../../components/form";
import { SpanText } from "@/components/text";
import DailyStatView from "./DailyStatView.vue";
import CourseStatView from "./CourseStatView.vue";
import api from "@/service/api";
import { shallowRef } from "vue";
import { useStore } from "vuex";

export default {
  components: {
    ActionIcon,
    SpanText,
    DailyStatView,
    CourseStatView,
  },
  setup() {
    const exams = shallowRef(null);
    const menus = [
      { text: "오늘", cmd: "daily", daily: true },
      {
        text: "단계별",
        cmd: "level",
        level: true,
        args: { origin: "L" },
      },
      {
        text: "교과서",
        cmd: "book",
        book: true,
        args: { origin: "B" },
      },
    ];
    const store = useStore();
    const license = store.getters["exam/activeLicense"];
    const levels = store.getters["course/levels"];
    const books = store.getters["course/books"];
    const activeMenu = shallowRef(menus[0]);
    const modal = shallowRef(null);
    const chapterStats = {
      level: null,
      book: null,
    };
    const switchView = (menu) => {
      activeMenu.value = menu;
      modal.value = { comp: menu.comp, args: menu.args };
    };

    const hideModal = () => {
      modal.value = null;
    };
    const createExamMap = (exams) => {
      const map = new Map();
      exams.forEach((exam) => {
        let elems = map.get(exam.sectionRef);
        if (!elems) {
          elems = { W: 0, S: 0 };
          map.set(exam.sectionRef, elems);
        }
        /*
         * 차트에 정답 갯수만 표시함
         */
        // const total = exam.numOfQuestions;
        const correct = exam.submissions.filter((sbm) => sbm.correct);
        // const failed = exam.submissions.length - correct;
        // const skipped = total - exam.submissions.length;
        elems[exam.type] += correct.length;
      });
      return map;
    };
    const createChapterStats = (examMap, chapters) => {
      return chapters.map((chap) => {
        const sentences = chap.sections.flatMap((sec) => sec.sentences);
        const cntS = sentences.filter((sen) => sen.type === "S").length;
        const cntW = sentences.length - cntS;
        const stat = new ChapterSummary(
          chap,
          { total: cntW, correct: 0 },
          { total: cntS, correct: 0 }
        );
        chap.sections.forEach((sec) => {
          const submission = examMap.get(sec.seq);
          if (submission) {
            const { W, S } = submission;
            stat.setCorrect(W, S);
          }
        });
        return stat;
      });
    };

    const loadData = () => {
      return api.exam.queryBySegments(license.uuid).then((res) => {
        exams.value = res.quiz;
        const examMap = createExamMap(exams.value);
        chapterStats.level = createChapterStats(examMap, levels);
        chapterStats.book = createChapterStats(examMap, books);
      });
    };
    loadData();
    return {
      modal,
      menus,
      exams,
      activeMenu,
      chapterStats,
      switchView,
      hideModal,
    };
  },
};
</script>

<style lang="scss" scoped>
.progress-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  .ctrls {
    position: absolute;
    right: 6px;
    top: 0;
    font-size: 1rem;
    display: flex;
    column-gap: 6px;
    button {
      border: none;
      outline: none;
      padding: 4px 6px;
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
      height: 28px;
      &.active {
        color: white;
        font-weight: 500;
        height: 32px;
        font-size: 1.25rem;
        &.daily {
          background-color: crimson;
        }
        &.level {
          color: var(--aac-color-pink-900);
          background-color: var(--aac-color-pink-400);
        }
        &.book {
          color: var(--aac-color-yellow-900);
          background-color: var(--aac-color-yellow-400);
        }
      }
    }
  }
}
</style>
