<template>
  <div class="box">
    <button
      v-for="chapter in chapters"
      :key="chapter.seq"
      @click="showSectionControl(chapter)"
      class="nude"
      :class="{ active: activeChapter === chapter }"
    >
      {{ chapter.desc.substring(0, 1) }}
    </button>
  </div>
  <div v-if="activeChapter" class="section">
    <button
      class="nude"
      :class="{ active: activeSection === undefined }"
      @click="flushChart(undefined)"
    >
      전체
    </button>
    <button
      v-for="section in activeChapter.sections.filter((sec) => sec.level > 0)"
      :key="section.seq"
      @click="flushChart(section)"
      class="nude"
      :class="{ active: activeSection === section }"
    >
      <span class="level">{{ section.level }}</span
      ><span class="desc">{{ section.description }}</span>
    </button>
  </div>
</template>

<script setup>
/**
 * course(가 ~ 차)별 조회 메뉴
 */
import { useStore } from "vuex";
import { computed, ref, defineEmits, defineProps, reactive, watch } from "vue";

/** @type { Readonly<{
    exams?: import('./exam-paper').StudentExamList ;
}>} */
const props = defineProps(["exams"]);
const emit = defineEmits({
  chart: Object,
});

const store = useStore();
const chapters = computed(() => store.getters["course/levels"]);
console.log(chapters);

const activeChapter = ref(undefined);
const activeSection = ref(undefined);
/**
 * @type {{ exams?: import('./exam-paper').StudentExamList}}
 */
const chartData = reactive({
  exams: undefined,
});
const flushChart = (section) => {
  const cols = [
    { id: "legend", type: "string", label: "Segments" },
    {
      id: "score",
      type: "number",
      label: "점수",
    },
    { id: "percent-text", type: "string", role: "annotation" },
  ];
  const exams = section
    ? chartData.exams.mapBy((examPaper) => examPaper.sectionRef === section.seq)
    : chartData.exams;
  const recent = exams.getRecentDate();
  const vs = exams.getValuesByMonth(recent, 12);
  const rows = vs.map(({ date, submissions }) => {
    date.push(10, 0, 0); // 10:00:00
    const year = date[1] === 1 ? `${date[0]}년` : "";
    const month = { v: `${year}${date[1]}월` };
    const scoreData = { solved: 0, total: 0 };
    submissions
      .map((sbm) => Object.values(sbm.analysis))
      .reduce((data, scores) => {
        scores.forEach(([solved, total]) => {
          data.solved += solved / total;
          data.total += 1;
        });
        return data;
      }, scoreData);

    // const total = submissions.length;
    // const solved =
    //   total > 0 ? submissions.filter((sbm) => sbm.correct).length : 0;
    // const score = { v: total === 0 ? 0 : (solved / total) * 100 };
    const value =
      scoreData.total === 0 ? null : (scoreData.solved / scoreData.total) * 100;
    const score = {
      v: value || 0,
    };
    const annotation = {
      v: value !== null ? `${value.toFixed(1)}%` : "없음",
    };
    activeSection.value = section;
    return { c: [month, score, annotation] };
  });
  emit("chart", { section, cols, rows });
};
const showSectionControl = (chapter) => {
  const { exams } = props;
  const sectionSet = chapter.sections.reduce((set, section) => {
    set.add(section.seq);
    return set;
  }, new Set());
  const courseExam = exams.mapBy(
    (/** @type {import('./exam-paper').ExamPaper}*/ paper) =>
      sectionSet.has(paper.sectionRef)
  );
  console.log(chapter, courseExam);
  activeChapter.value = chapter;
  chartData.exams = courseExam;
  flushChart(undefined);
};
watch(
  () => props.exams,
  () => showSectionControl(activeChapter.value)
);
</script>

<style lang="scss" scoped>
.box {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  margin: 8px 0;
  padding: 6px;
  box-shadow: 0 0 4px #0000004d;
  border-radius: 8px;
  .nude {
    color: #777;
    border-radius: 6px;
    &.active {
      color: white;
      background-color: #0038bc;
    }
  }
}
.section {
  display: flex;
  flex-direction: column;
  row-gap: 4px;
  .nude {
    width: 100%;
    font-weight: 400;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
    border-radius: 8px;
    &.active {
      color: white;
      background-color: #0038bc;
      outline: 2px solid #0038bc4d;
    }
    &:hover {
      outline: 2px solid #0038bc4d;
    }
    &:active {
      transform: translate(1px, 1px);
    }
    .desc {
      white-space: nowrap;
    }
  }
}
</style>
