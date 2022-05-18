<template>
  <div class="level-analysis">
    <div class="analysis-body">
      <div class="left-menu">
        <div class="chapters" v-if="chapterLoaded">
          <select v-model="currentCourse">
            <option v-for="course in courses" :key="course.id" :value="course">
              {{ course.name }}
            </option>
          </select>
          <div
            class="chapter"
            v-for="chapter in currentCourse.chapters"
            :key="chapter.seq"
          >
            <h4
              class="title"
              @click="toggleChapter(chapter)"
              :class="{ expanded: isExpanded(chapter) }"
            >
              <ActionIcon class="chapter-icon" icon="navigate_next" /><span>{{
                chapter.desc
              }}</span>
            </h4>
            <template v-if="isExpanded(chapter)">
              <div
                class="section"
                v-for="section in chapter.sections"
                :key="section.seq"
                @click="showSection(section)"
              >
                <span class="lvl">{{
                  section.level >= 0 ? "" + section.level : "종"
                }}</span
                ><span class="text">{{ section.description }}</span>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="section-analysis">
        <SectionAnalysis v-if="activeSection" :section="activeSection" />
      </div>
    </div>
  </div>
</template>

<script>
import SectionAnalysis from "./SectionAnalysis.vue";
import { ActionIcon } from "@/components/form";
import { ref } from "@vue/reactivity";
import { useStore } from "vuex";
import { computed, watch } from "@vue/runtime-core";
export default {
  components: {
    ActionIcon,
    SectionAnalysis,
  },
  setup() {
    const store = useStore();
    const chapterLoaded = computed(() => store.getters["course/ready"]);
    let courses = [];
    const currentCourse = ref(null);
    const expanded = ref(new Set());
    const isExpanded = (chapter) => expanded.value.has(chapter);
    const toggleChapter = (chapter) => {
      const existing = expanded.value.has(chapter);
      if (existing) {
        expanded.value.delete(chapter);
      } else {
        expanded.value.add(chapter);
      }
    };
    const activeSection = ref(null);
    const showSection = (secion) => {
      activeSection.value = secion;
    };
    watch(currentCourse, () => {
      activeSection.value = null;
    });
    watch(
      () => chapterLoaded.value,
      (loaded) => {
        if (!loaded) {
          return;
        }
        courses.push({ id: "none", name: "[선택]", chapters: [] });
        courses.push({
          id: "level",
          name: "단계별 학습",
          chapters: store.getters["course/levels"],
        });
        courses.push({
          id: "book",
          name: "교과서",
          chapters: store.getters["course/books"],
        });
        currentCourse.value = courses[0];
      },
      { immediate: true }
    );
    return {
      chapterLoaded,
      courses,
      currentCourse,
      activeSection,
      toggleChapter,
      isExpanded,
      showSection,
    };
  },
};
</script>

<style lang="scss" scoped>
.level-analysis {
  height: 100%;
  display: flex;
  flex-direction: column;
  .analysis-body {
    flex: 1 1 auto;
    display: flex;
    height: 100%;
    padding: 8px;
    .left-menu {
      flex: 0 0 200px;
      overflow-y: auto;
      position: relative;
      .chapters {
        position: relative;
        select {
          width: 100%;
          position: sticky;
          top: 0;
          padding: 4px;
          margin-bottom: 4px;
          z-index: 10;
        }
        .chapter {
          .title {
            display: flex;
            align-items: center;
            cursor: pointer;
            user-select: none;
            font-size: 1.25rem;
            &.expanded {
              .chapter-icon {
                transform: rotate(90deg);
              }
            }
          }
          .section {
            margin-left: 16px;
            padding: 2px 8px;
            cursor: pointer;
            display: flex;
            align-items: flex-start;
            > span {
              padding: 4px;
              &.lvl {
                background-color: #d4e5ff;
                color: #26508e;
              }
            }
          }
        }
      }
    }
    .section-analysis {
      flex: 1 1 auto;
      overflow-y: auto;
    }
  }
}
</style>
