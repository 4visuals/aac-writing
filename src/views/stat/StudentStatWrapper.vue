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
import { shallowRef, reactive, computed, watch } from "vue";
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
    const loginUser = computed(() => store.getters["user/currentUser"]);
    const license = computed(() => store.getters["exam/activeLicense"]);
    const levels = computed(() => store.getters["course/levels"]);
    const books = computed(() => store.getters["course/books"]);

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
    let dataLoaded = false;
    const loadData = () => {
      if (dataLoaded || !loginUser.value || !license.value) {
        return;
      }
      dataLoaded = true;
      return api.exam.queryBySegments(license.value.uuid).then((res) => {
        exams.value = res.quiz;
        const examMap = createExamMap(exams.value);
        chapterStats.level = createChapterStats(examMap, levels.value);
        chapterStats.book = createChapterStats(examMap, books.value);
        openStatePage("today");
      });
    };

    // loadData();

    watch(loginUser, loadData, { immediate: true });
    watch(license, loadData, { immediate: true });
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
