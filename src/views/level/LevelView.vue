<template>
  <div class="container">
    <BrandPanel theme="pink" text="단계별 받아쓰기" path="level" />
    <QuizHistoryView
      v-if="license && chapters.length > 0"
      class="group"
      origin="L"
      @itemClicked="(section) => showDetail(section, 'pink')"
    />
    <div
      class="row group"
      v-for="(chapter, idx) in chapters"
      :key="chapter.seq"
      :class="idx % 2 === 0 ? 'ltr' : 'rtl'"
    >
      <div class="col-12">
        <h3 class="title">{{ chapter.desc }}</h3>
      </div>
      <transition-group name="section" appear>
        <div
          class="col-6 col-sm-6 col-md-4 col-lg-3 section-outer"
          v-for="section in chapter.sections.filter((sec) => sec.level >= 0)"
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
      </transition-group>
      <transition name="section" appear>
        <div class="col-12 col-sm-6 col-md-4 col-lg-3 section-outer">
          <SectionButton
            :item="chapter.sections.filter((sec) => sec.level == -1)[0]"
            :idx="'TEST'"
            @itemClicked="(section) => showDetail(section, 'green')"
            theme="green"
          />
        </div>
      </transition>
    </div>
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
import { computed, ref } from "vue";
import router from "@/router";
import QuizHistoryView from "../QuizHistoryView.vue";

export default {
  props: ["cate"],
  components: {
    SectionButton,
    SectionView,
    Modal,
    BrandPanel,
    QuizHistoryView,
  },
  setup() {
    const store = useStore();
    // console.log(store.state.course.cates.level);
    const license = computed(() => store.getters["exam/activeLicense"]);
    const modal = ref(null);

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

    return {
      modal,
      license,
      chapters,
      moveTo,
      showDetail,
      activeCate,
      themeRef,
      hideModal,
      sectionDir,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";

@include mobile {
  .group {
    margin-bottom: 2rem;
  }
  .title {
    font-size: 1.25rem;
  }
}
@include tablet {
  .group {
    margin-bottom: 4rem;
  }
  .title {
    font-size: 3vmin;
  }
}
@include desktop {
  .group {
    margin-bottom: 4rem;
  }
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
    transform: translateX(-100%);
    opacity: 0;
  }
}
.rtl {
  .section-enter-from {
    transform: translateX(100%);
    opacity: 0;
  }
}

.ltr,
.rtl {
  .section-enter-active {
    transition: all 0.5s ease-out;
  }
}
</style>
