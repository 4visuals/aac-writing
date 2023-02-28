<template>
  <div class="container layout-h-child w-1190px">
    <QuizHistoryView
      v-if="$route.path === '/book' && license && chapters.length > 0"
      origin="B"
      @itemClicked="(section) => gotoSectionView({ section })"
    />
    <router-view
      cate="books"
      theme="brown"
      @active-section="gotoSectionView"
      @back="$router.push('/book')"
    />
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed, ref, watch } from "vue";
import router from "@/router";
import QuizHistoryView from "../QuizHistoryView.vue";
import { logger } from "@/service/util";

export default {
  props: ["cate"],
  components: {
    QuizHistoryView,
  },
  setup() {
    const theme = ref("none");
    const challenge = ref(true);
    const store = useStore();
    // const route = useRoute();
    const license = computed(() => store.getters["exam/activeLicense"]);
    const segmentHistory = computed(() => store.getters["exam/segmentHistory"]);
    logger.log(segmentHistory, "SEG HISTORY");
    const modal = ref(null);
    const activeChapter = ref(null);
    // let chapterEl = null;
    const activeCate = ref(null);
    const themeRef = ref("default");
    const showDetail = (cate, theme) => {
      activeCate.value = cate;
      themeRef.value = theme;
      // sound.playSound();
    };

    const chapters = computed(() => store.state.course.chapters.books);
    const moveTo = (quiz) => {
      router.push("/quiz/" + quiz.seq);
    };
    const hideModal = () => {
      activeCate.value = null;
    };
    const sectionDir = (idx) => {
      return idx % 2 === 0 ? "ltr" : "rtl";
    };
    const collapse = (el) => {
      if (el) {
        // const h = el.dataset.height;
        el.style.height = "";
      }
    };
    const markHeight = (groupEl) => {
      const h = groupEl.clientHeight;
      groupEl.dataset.height = h;
      collapse(groupEl);
    };

    const toggleActiveChapter = (chapter) => {
      let seq = null;
      if (activeChapter.value === chapter) {
        activeChapter.value = null;
        // store.commit('ui/setActiveChapter', {group: 'level', seq: null})
      } else {
        activeChapter.value = chapter;
        seq = chapter.seq;
      }
      store.commit("ui/setActiveChapter", { group: "level", seq });
    };
    const chapterText = (chapter) => {
      const { sections } = chapter;
      const min = sections[0].level;
      const max = sections[sections.length - 2].level;
      return `${min} - ${max}단계`;
    };
    const gotoSectionView = (e) => {
      console.log(e);
      router.push("/book/section/" + e.section.seq);
    };
    watch(
      () => chapters.value,
      (levels) => {
        if (!levels) {
          return;
        }
        const seq = store.getters["ui/activeChapter"]("book");
        const chapter = chapters.value.find((chapter) => chapter.seq === seq);
        activeChapter.value = chapter;
      },
      {
        immediate: true,
      }
    );
    return {
      theme,
      challenge,
      activeChapter,
      modal,
      license,
      chapters,
      moveTo,
      showDetail,
      activeCate,
      themeRef,
      hideModal,
      sectionDir,
      toggleActiveChapter,
      markHeight,
      collapse,
      chapterText,
      gotoSectionView,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
$timing-fn: cubic-bezier(0.5, 0.25, 0, 1);
.container {
  padding-bottom: 16px;
}
</style>
