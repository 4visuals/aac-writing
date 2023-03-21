<template>
  <div
    class="container layout-h-child w-1190px"
    :class="{ pt16: $route.path !== '/book' }"
  >
    <QuizHistoryView
      v-if="$route.path === '/book' && license && chapters.length > 0"
      origin="B"
      @itemClicked="(section) => gotoSectionView({ section })"
    />
    <router-view
      cate="books"
      :theme="theme"
      @active-section="gotoSectionView"
      @back="$router.push('/book')"
    />
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed } from "vue";
import QuizHistoryView from "../QuizHistoryView.vue";
import { checkAppState } from "../app-state-validator";
import { useRouter } from "vue-router";

export default {
  props: ["cate"],
  components: {
    QuizHistoryView,
  },
  setup() {
    const theme = "brown";
    const store = useStore();
    const license = computed(() => store.getters["exam/activeLicense"]);
    const chapters = computed(() => store.state.course.chapters.books);
    const router = useRouter();
    const gotoSectionView = (e) => {
      router.push("/book/section/" + e.section.seq);
    };
    checkAppState({ router });
    return {
      theme,
      license,
      chapters,
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
  &.pt16 {
    padding-top: 16px;
  }
}
</style>
