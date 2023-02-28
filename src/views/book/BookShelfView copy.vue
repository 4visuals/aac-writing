<template>
  <div class="container book-list">
    <BrandPanel theme="gold" text="교과서 받아쓰기" path="book" />
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
          <span class="chapter-name" @click="toggleActiveChapter(chapter)">{{
            chapter.desc
          }}</span
          ><ActionIcon
            :icon="activeChapter === chapter ? 'expand_less' : 'expand_more'"
            @click="toggleActiveChapter(chapter)"
          />
        </ParaText>
      </div>
      <template v-if="activeChapter === chapter">
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
              theme="brown"
              :history="true"
            />
          </div>
        </transition-group>
      </template>
    </div>
    <teleport to="body" v-if="activeSection">
      <Modal ref="modal" @hidden="hideModal">
        <BookSectionView :cate="activeSection" :theme="theme" />
      </Modal>
    </teleport>
  </div>
</template>

<script>
import { BrandPanel } from "@/components/brand";
import BookSectionView from "./BookSectionView.vue";
import { ParaText } from "@/components/text";
import { ActionIcon } from "../../components/form";
// import BookView from "./BookView.vue";
// import TextBook from "@/views/book/TextBook.vue";
import SectionButton from "@/components/SectionButton.vue";
import { useStore } from "vuex";
import { computed, ref, watch } from "vue";
export default {
  components: {
    BrandPanel,
    ParaText,
    BookSectionView,
    SectionButton,
    ActionIcon,
  },
  setup() {
    const store = useStore();

    // const activeBook = ref(null);
    const activeChapter = ref(null);
    const activeSection = ref(null);
    // const theme = "yellow";
    const theme = store.state.ui.themes["gold"];
    const chapters = computed(() => store.state.course.chapters.books);

    const front = {
      title: (book) => {
        const names = book.names || book.desc.split(" ");
        book.names = names;
        return names[0];
      },
      sub1: (book) => book.names[1],
      sub2: (book) => book.names[2],
    };

    // const openBook = (book) => {
    //   activeBook.value = book;
    // };
    const showDetail = (section) => {
      activeSection.value = section;
    };
    const hideModal = () => {
      activeSection.value = null;
    };
    const toggleActiveChapter = (chapter) => {
      let seq = null;
      if (activeChapter.value === chapter) {
        activeChapter.value = null;
      } else {
        activeChapter.value = chapter;
        seq = chapter.seq;
      }
      store.commit("ui/setActiveChapter", { group: "book", seq });
    };

    watch(
      () => chapters.value,
      (books) => {
        if (!books) {
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
      chapters,
      front,
      activeChapter,
      // activeBook,
      activeSection,
      theme,
      // openBook,
      showDetail,
      hideModal,
      toggleActiveChapter,
    };
  },
};
</script>

<style lang="scss" scoped>
$timing-fn: cubic-bezier(0.5, 0.25, 0, 1);
.book-list {
  .group {
    color: #865900;
    background-image: linear-gradient(0deg, #fff9cdc9 50%, #ffffffcc 80%);
    margin-bottom: 8px;
    padding: 8px 4px;
    border-radius: 8px;
    border: 1px solid #8659004d;
    margin-left: 0;
    margin-right: 0;
    // box-shadow: rgb(0 0 0 / 4%) 0px 0px 0px 1px inset,
    //   rgb(0 0 0 / 8%) 0px 0px 0px 1px inset;
    &.active {
      margin-top: 16px;
      margin-bottom: 16px;
      box-shadow: 8px 8px 16px #cfce9957, 0px 0px 4px #cfce9957;
      padding-bottom: 24px;
      background-color: #fff7c0;
      border-color: transparent;
      padding-bottom: 24px;
      // background-image: linear-gradient(15deg, #ffeeff 45%, #cdfaff 100%);
      background-image: linear-gradient(15deg, #fff7c0 75%, #cdfaff 100%);
    }
  }

  .title {
    display: flex;
    cursor: pointer;
    .chapter-name {
      flex: 1 1 auto;
    }
  }
  .book-holder {
    padding: 1rem 0 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    .book-title {
      flex: 0 0 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .ltr {
    .section-enter-from {
      transform: translateX(-10%);
      opacity: 0;
    }
  }
  .rtl {
    .section-enter-from {
      transform: translateX(-10%);
      opacity: 0;
    }
  }

  .ltr,
  .rtl {
    .section-enter-active {
      transition: all 0.5s $timing-fn;
    }
  }
}
.fade-enter-from {
  opacity: 0.4;
  transform: scale(0.9);
}
.fade-enter-active {
  transition: all 0.25s $timing-fn;
}
</style>
