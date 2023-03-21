<template>
  <div class="container layout-h-child w-1190px">
    <StatNav :menu="page.name" @page="openStatePage" @exit="gotoMain" />
    <CourseStatView
      v-if="page.origin === 'L'"
      origin="L"
      :exams="exams"
      :courseStat="page.stat"
      @exit="gotoMain"
    />
    <CourseStatView
      v-else-if="page.origin === 'B'"
      origin="B"
      :exams="exams"
      :courseStat="page.stat"
      @exit="gotoMain"
    />
    <DailyStatView v-else />
  </div>
</template>

<script>
import StatNav from "../../components/nav/StatNav.vue";
import api from "@/service/api";

import examLoader from "./exam-loader";
import { shallowRef, reactive } from "vue";
import { useStore } from "vuex";
// import { useRouter } from "vue-router";
import DailyStatView from "../../components/stats/DailyStatView.vue";
import CourseStatView from "../../components/stats/CourseStatView.vue";
import { useRoute, useRouter } from "vue-router";

export default {
  components: { StatNav, DailyStatView, CourseStatView },
  setup() {
    const exams = shallowRef(null);
    const store = useStore();
    const license = store.getters["exam/activeLicense"];
    const levels = store.getters["course/levels"];
    const books = store.getters["course/books"];

    const route = useRoute();
    const router = useRouter();
    const backPath = route.params.backPath || "/level";
    const page = reactive({
      name: "today",
      origin: "T",
      stat: null,
    });

    const chapterStats = {
      level: null,
      book: null,
    };
    const { createExamMap, createChapterStats } = examLoader;

    console.log(route.params);
    const openStatePage = (pageName) => {
      page.name = pageName;
      if (pageName === "level") {
        page.origin = "L";
        page.stat = chapterStats.level;
      } else if (pageName === "book") {
        page.origin = "B";
        page.stat = chapterStats.book;
      } else if (pageName === "today") {
        page.origin = "T";
        page.stat = null;
      }
    };
    const gotoMain = () => {
      router.replace(backPath);
    };
    const loadData = () => {
      return api.exam.queryBySegments(license.uuid).then((res) => {
        exams.value = res.quiz;
        const examMap = createExamMap(exams.value);
        chapterStats.level = createChapterStats(examMap, levels);
        chapterStats.book = createChapterStats(examMap, books);
        openStatePage("today");
      });
    };

    loadData();
    return { exams, page, openStatePage, gotoMain };
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
}
</style>
