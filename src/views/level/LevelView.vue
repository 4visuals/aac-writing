<template>
  <div class="container layout-h-child w-1190px">
    <QuizHistoryView
      v-if="$route.path === '/level' && license && chapters.length > 0"
      origin="L"
      @itemClicked="(section) => gotoSectionView({ section })"
    />
    <router-view
      cate="levels"
      theme="blue"
      @active-section="gotoSectionView"
      @back="$router.push('/level')"
    />
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed, ref, watch } from "vue";
import router from "@/router";
import QuizHistoryView from "../QuizHistoryView.vue";

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

    const chapters = computed(() => store.state.course.chapters.levels);
    const moveTo = (quiz) => {
      console.log(quiz);
      router.push("/quiz/" + quiz.seq);
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

    const chapterText = (chapter) => {
      const { sections } = chapter;
      const min = sections[0].level;
      const max = sections[sections.length - 2].level;
      return `${min} - ${max}단계`;
    };
    const gotoSectionView = (e) => {
      console.log(e);
      router.push("/level/section/" + e.section.seq);
    };
    watch(
      () => chapters.value,
      (levels) => {
        if (!levels) {
          return;
        }
        const seq = store.getters["ui/activeChapter"]("level");
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
      sectionDir,
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
