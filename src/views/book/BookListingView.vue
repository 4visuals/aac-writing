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
            <SpanText>국어</SpanText>
            <SpanText class="chapter-name">{{
              chapter.desc.substring(3)
            }}</SpanText>
          </ParaText>
        </div>
        <transition name="section">
          <div v-if="activeChapter === chapter" class="col-12 row">
            <div
              class="col-12 col-sm-6 col-md-4 col-lg-4 section-outer"
              v-for="section in chapter.sections.filter(
                (sec) => sec.level >= 0
              )"
              :key="section.seq"
            >
              <SectionButton
                :item="section"
                :idx="section.level"
                @itemClicked="$emit('active-section', { section })"
                :history="true"
                theme="brown"
              />
            </div>
          </div>
        </transition>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import SectionButton from "@/components/SectionButton.vue";
import { useStore } from "vuex";
import { computed, ref, watch } from "vue";
import { ParaText, SpanText } from "../../components/text";
import { ActionIcon } from "../../components/form";
import { listingViewHelper } from "../app-state-validator";
// import util from "@/service/util";

const store = useStore();
const activeChapter = ref(null);
const chapters = computed(() => store.state.course.chapters.books);
const sectionRecordMap = computed(() => store.state.record.perfectMap);
const perfectInfo = ref({ mod: 0 });

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

const { findActiveChapter, resolvePerfectChapters } = listingViewHelper();

// const chapterText = (chapter) => util.chapter.rangeText(chapter, "단계");
watch(
  () => chapters.value,
  (chapters) => {
    if (!chapters) {
      return;
    }
    activeChapter.value = findActiveChapter({ store, chapters });
    perfectInfo.value = resolvePerfectChapters({
      chapters,
      sectionRecordMap: sectionRecordMap.value,
    });
  },
  {
    immediate: true,
  }
);
watch(
  () => sectionRecordMap.value,
  () => {
    const _chapters = chapters.value;
    activeChapter.value = findActiveChapter({ store, chapters: _chapters });
    perfectInfo.value = resolvePerfectChapters({
      chapters: _chapters,
      sectionRecordMap: sectionRecordMap.value,
    });
    resolvePerfectChapters({
      store,
      chapters: chapters.value,
      sectionRecordMap: sectionRecordMap.value,
    });
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
$timing-fn: cubic-bezier(0.5, 0.25, 0, 1);
$radius: 15px;
$border-color: #a69059;
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
      background-color: #ffeea8;
      margin-left: 0;
      margin-right: 0;
      padding-top: 10px;
      padding-bottom: 10px;
      padding-left: 64px;
      @include mobile {
        padding: 12px 0;
      }
    }
  }
  .chap-title {
    position: relative;
    padding: 10px 24px;
    .title {
      display: flex;
      align-items: center;
      column-gap: 16px;
      color: #865900;
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
