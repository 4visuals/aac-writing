<template>
  <div class="container">
    <BrandPanel :theme="theme" text="단계별 받아쓰기" path="level" />
    <QuizHistoryView
      v-if="license && chapters.length > 0"
      origin="L"
      @itemClicked="(section) => showDetail(section, 'pink')"
    />
    <transition-group name="chapter">
      <div
        class="row ltr group"
        v-for="chapter in chapters"
        :key="chapter.seq"
        :class="{
          active: activeChapter === chapter,
        }"
      >
        <div class="col-12">
          <ParaText :lg="true" class="title">
            <span
              class="chapter-name"
              @click="toggleActiveChapter(chapter, $event.target)"
              >{{ chapter.desc }}</span
            ><ActionIcon
              :icon="activeChapter === chapter ? 'expand_less' : 'expand_more'"
              @click="toggleActiveChapter(chapter)"
            />
          </ParaText>
        </div>
        <transition name="section">
          <div v-if="activeChapter === chapter" class="col-12 row">
            <div
              class="col-12 col-sm-6 col-md-4 col-lg-3 section-outer"
              v-for="section in chapter.sections.filter(
                (sec) => sec.level >= 0
              )"
              :key="section.seq"
            >
              <SectionButton
                :item="section"
                :idx="section.level"
                @itemClicked="(section) => showDetail(section, 'pink')"
                theme="pink"
                :history="true"
              />
            </div>

            <div class="col-12 col-sm-6 col-md-4 col-lg-3 section-outer">
              <SectionButton
                :item="chapter.sections.filter((sec) => sec.level == -1)[0]"
                :idx="'도전'"
                @itemClicked="(section) => showDetail(section, 'green')"
                theme="green"
              />
            </div>
          </div>
        </transition>
      </div>
    </transition-group>
    <teleport to="body" v-if="activeCate">
      <Modal ref="modal" height="90%" @hidden="hideModal">
        <SectionView
          :cate="activeCate"
          :theme="themeRef"
          :quizOnly="activeCate.level === -1"
        />
      </Modal>
    </teleport>
  </div>
</template>

<script>
// import sound from "@/service/sound";
import SectionButton from "@/components/SectionButton.vue";
import { BrandPanel } from "@/components/brand";
import { Modal } from "@/components";
import SectionView from "./SectionView.vue";
import { useStore } from "vuex";
import { computed, ref, watch } from "vue";
import router from "@/router";
import QuizHistoryView from "../QuizHistoryView.vue";
import { ParaText } from "../../components/text";
import { ActionIcon } from "../../components/form";
import { useRoute } from "vue-router";
export default {
  props: ["cate"],
  components: {
    SectionButton,
    SectionView,
    Modal,
    BrandPanel,
    QuizHistoryView,
    ParaText,
    ActionIcon,
  },
  setup() {
    const theme = ref("none");
    const challenge = ref(true);
    const store = useStore();
    const route = useRoute();
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

    watch(
      () => route.name,
      () => {
        const path = route.path.substring(1);
        const themeValue = path === "level" ? "pink" : "gold";
        theme.value = themeValue;
        challenge.value = path === "level";
      },
      { immediate: true }
    );
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
      hideModal,
      sectionDir,
      toggleActiveChapter,
      markHeight,
      collapse,
      // expand,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
$timing-fn: cubic-bezier(0.5, 0.25, 0, 1);
.group {
  color: #d23d70;
  background-image: linear-gradient(0deg, #ffe4f469 50%, #ffffffcc 80%);
  margin-bottom: 8px;
  padding: 8px 4px;
  border-radius: 8px;
  /* box-shadow: #ffb24114 0px 0px 0px 1px inset, #e3a03d7d 0px 0px 0px 1px inset; */
  border: 1px solid #d23d7044;
  transition: height 0.2s $timing-fn 0.1s;
  &.active {
    margin-top: 16px;
    margin-bottom: 16px;
    box-shadow: 8px 8px 16px #cf99be57, 0px 0px 4px #cf99be57;
    border-color: transparent;
    padding-bottom: 24px;
    // background-image: linear-gradient(15deg, #ffeeff 45%, #cdfaff 100%);
    background-image: linear-gradient(15deg, #faffde 75%, #cdfaff 100%);
  }
}

.title {
  display: flex;
  cursor: pointer;
  .chapter-name {
    flex: 1 1 auto;
  }
}
@include mobile {
  .title {
    font-size: 1.25rem;
  }
}
@include tablet {
  .title {
    font-size: 3vmin;
  }
}
@include desktop {
  .title {
    font-size: 3vmin;
  }
}
.section-outer {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.ltr {
  .section-enter-from {
    transform: translateX(-1%);
    opacity: 0;
    // transform: scale(0.95);
  }
  .section-leave-to {
    opacity: 0;
    // opacity: 0.5;
    // transform: scale(0.9);
  }
}
.ltr {
  .section-enter-active {
    transition: all 0.5s $timing-fn;
  }
  .section-leave-active {
    transition: all 0s $timing-fn;
  }
}
</style>
