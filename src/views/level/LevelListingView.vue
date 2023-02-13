<template>
  <div class="levels">
    <transition-group name="chapter">
      <div
        class="row ltr group"
        v-for="chapter in chapters"
        :key="chapter.seq"
        :class="{
          active: activeChapter === chapter,
        }"
      >
        <div
          class="col-12 chap-title"
          @click="toggleActiveChapter(chapter, $event.target)"
        >
          <ParaText :lg="true" class="title">
            <ActionIcon
              class="arrow"
              :icon="
                activeChapter === chapter ? 'arrow_drop_down' : 'arrow_right'
              "
              @click.stop="toggleActiveChapter(chapter)"
            />
            <AppButton
              size="chapter"
              :text="chapterText(chapter)"
              @click="toggleActiveChapter(chapter)"
            />
            <SpanText class="chapter-name">{{
              chapter.desc.substring(3)
            }}</SpanText>
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
                @itemClicked="
                  $emit('active-section', { section, theme: 'pink' })
                "
                :history="true"
                theme="blue"
              />
            </div>

            <div class="col-12 col-sm-6 col-md-4 col-lg-3 section-outer">
              <SectionButton
                :item="chapter.sections.filter((sec) => sec.level == -1)[0]"
                :idx="'도전'"
                theme="purple"
                @itemClicked="
                  (section) =>
                    $emit('active-section', { section, theme: 'green' })
                "
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
import { Modal } from "@/components";
import SectionView from "./SectionView.vue";
import { useStore } from "vuex";
import { computed, ref, watch } from "vue";
import router from "@/router";
import { ParaText, SpanText } from "../../components/text";
import { ActionIcon } from "../../components/form";
import { useRoute } from "vue-router";
import util, { logger } from "@/service/util";

export default {
  props: {
    /**
     * levels: 단계별,
     * books: 교과서
     */
    cate: {
      type: String,
      validator: (cate) => ["levels", "books"].includes(cate),
    },
  },
  components: {
    SectionButton,
    SectionView,
    Modal,
    ParaText,
    SpanText,
    ActionIcon,
  },
  setup(props) {
    const theme = ref("none");
    const challenge = ref(true);
    const store = useStore();
    const route = useRoute();
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

    const chapters = computed(() => store.state.course.chapters[props.cate]);
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
    const chapterText = (chapter) => util.chapter.rangeText(chapter, "단계");
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
      chapterText,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
$timing-fn: cubic-bezier(0.5, 0.25, 0, 1);
$radius: 15px;
$border-color: #c1d9e8;
.group {
  /* box-shadow: #ffb24114 0px 0px 0px 1px inset, #e3a03d7d 0px 0px 0px 1px inset; */
  transition: height 0.2s $timing-fn 0.1s;
  margin-left: 0;
  margin-right: 0;
  background-color: white;
  border-bottom: 1px solid $border-color;
  &:first-child {
    border-top-left-radius: $radius;
    border-top-right-radius: $radius;
  }
  &:last-child {
    border-bottom-left-radius: $radius;
    border-bottom-right-radius: $radius;
    border: none;
    overflow-y: hidden;
  }
  &.active {
    // box-shadow: 8px 8px 16px #cf99be57, 0px 0px 4px #cf99be57;
    // border-color: transparent;
    // padding-bottom: 0px;
    // background-image: linear-gradient(15deg, #faffde 75%, #cdfaff 100%);
    .chap-title {
      border-bottom: 1px solid $border-color;
      .reward {
        transform: translateY(-50%);
        .crown {
          width: 32px;
          height: 32px;
        }
      }
    }
    .row {
      background-color: #b4dcf9;
      margin-left: 0;
      margin-right: 0;
      padding-top: 10px;
      padding-bottom: 10px;
      padding-left: 64px;
    }
  }
  .chap-title {
    position: relative;
    padding: 10px 24px;
    .title {
      display: flex;
      align-items: center;
      column-gap: 16px;
      color: #4b7bec;
      .arrow {
        font-size: 3rem;
      }
    }
    .reward {
      position: absolute;
      display: flex;
      column-gap: 16px;
      transform: translateY(-50%);
      top: 50%;
      right: 40px;
      z-index: 5;
      .crown {
        width: 28px;
        height: 28px;
        img {
          width: 100%;
          height: auto;
          filter: drop-shadow(1px 1px 3px #0000009d);
        }
      }
    }
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
  padding: 12px;
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
