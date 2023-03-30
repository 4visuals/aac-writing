<template>
  <div class="level-stat">
    <div class="nav">
      <h4>
        <span class="label"
          >{{ origin === "L" ? "단계별" : "교과서" }} 학습 통계</span
        >
        <ActionIcon class="btn-exit" icon="cancel" @click="$emit('exit')" />
      </h4>
    </div>
    <div class="stat-body">
      <div class="dimmer" v-if="menuVisible" @click="menuVisible = false"></div>
      <div class="floating menu" v-if="menuVisible">
        <div
          class="item"
          v-for="chapter in chapters"
          :key="chapter.seq"
          :class="{ active: chapter === activeChapter }"
          @click="showSectionChart(chapter)"
        >
          <SpanText class="desc">{{ getChapterTitle(chapter) }}</SpanText>
        </div>
      </div>
      <ActionIcon
        v-else
        class="btn-unfolding"
        icon="menu"
        @click="menuVisible = true"
      />

      <div class="charts" ref="chartEl" @click="closeDetail">
        <GoogleBarChart
          v-if="origin === 'L'"
          :chartFormat="wordChart"
          @select="showDetail"
        />
        <GoogleBarChart :chartFormat="sentenceChart" @select="showDetail" />
        <div class="detail" v-if="detailRef" @click.stop="">
          <SentenceSubmissionView
            class="submits"
            :paper="detailRef.exams[0]"
            :section="detailRef.section"
            @perfect="showConfetti"
            @close="closeDetail"
          />
          <canvas v-if="confettiVisible" class="confetti" ref="canvas"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { time } from "@/service/util";
import { ActionIcon } from "@/components/form";
import { SpanText } from "@/components/text";
import { useStore } from "vuex";
import { Segment } from "../../views/quiz";
import GoogleBarChart from "./GoogleBarChart.vue";
import SentenceSubmissionView from "../quiz/submission/SentenceSubmissionView.vue";
import confetti from "canvas-confetti";

import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  shallowRef,
  watch,
} from "vue";

import util from "../../service/util";
const courses = {
  L: { name: "course/levels", colors: ["#9952D6"] },
  B: { name: "course/books", colors: ["#E62E7B", "#91CC26", "#5BC5FF"] },
};
export default {
  components: {
    ActionIcon,
    SpanText,
    GoogleBarChart,
    SentenceSubmissionView,
  },
  props: ["origin", "exams", "courseStat"],
  setup(props) {
    const store = useStore();
    const chapters = computed(() => store.getters[courses[props.origin].name]);
    const wordChart = ref(null);
    const sentenceChart = ref(null);
    const chartEl = shallowRef(null);
    const detailRef = shallowRef(null);
    const activeChapter = shallowRef(null);
    const menuVisible = shallowRef(true);
    const canvas = ref(null);
    const confettiVisible = ref(false);
    let timer;
    let resizer;

    const createWordSegments = (chapter) => {
      const longestSection = chapter.sections.reduce((longest, section) => {
        return longest.sentences.length >= section.sentences.length
          ? longest
          : section;
      }, chapter.sections[0]);
      return Segment.createSegments(longestSection, "W");
    };
    const createChartData = (sections, segments, type) => {
      const rows = sections.map((section) => {
        // 주어진 section에 대한 chunks들
        const chunks = props.exams.filter(
          (exam) => exam.type === type && exam.sectionRef === section.seq
        );
        // chart.rows[i].c 에 바인딩되는 배열
        const rowArray = segments.map((seg) => {
          const chunk = chunks.find(
            (chunk) =>
              chunk.questionOffset === seg.offset &&
              chunk.numOfQuestions === seg.size
          );
          let cell = null;
          if (chunk) {
            const corrects = chunk.submissions.filter(
              (submit) => submit.correct
            );
            cell = {
              v: (100 * corrects.length) / chunk.numOfQuestions,
              p: { examRef: chunk.seq },
            };
          }
          return cell;
        });
        // 첫번째 컬럼(label)끼워 넣음
        const suffix = props.origin === "L" ? "단계" : "단원";
        const xAxisLabel =
          section.level >= 0 ? `${section.level}${suffix}` : "도전";
        rowArray.splice(0, 0, { v: xAxisLabel });
        return { c: rowArray };
      });
      return rows;
    };

    const createSentenceSegment = (chapter) => {
      // 문장은 모두 10문제로 동일함
      return Segment.createSegments(chapter.sections[0], "S");
    };
    const getChartArea = () => {
      const { offsetWidth, offsetHeight } = chartEl.value;
      return { width: offsetWidth, height: offsetHeight / 2 };
    };
    /**
     * google chart 조립
      const cols = [
        { id: "xAxis", label: "단계", type: "string" },
        { id: "chunk1", label: "1~10", type: "number" },
        { id: "chunk2", label: "11~20", type: "number" },
      ];
      const rows = [
        { c: [{ v: "5단계" }, { v: 45 }, { v: 78 }] },
        { c: [{ v: "6단계" }, { v: 39 }, { v: 51 }] },
      ];
      wordChart.value = {
        cols,
        rows,
      };
     */
    const showSectionChart = (chapter) => {
      closeDetail();
      if (activeChapter.value === chapter) {
        activeChapter.value = null;
        createCourseSummaryChart();
        return;
      }
      activeChapter.value = chapter;
      const area = getChartArea();
      const wordSegments = createWordSegments(chapter);
      const wordCols = wordSegments.map((seg) => ({
        id: `chunk${seg.index}`,
        label: `${seg.start + 1}~${seg.end}`,
        type: "number",
      }));
      wordCols.splice(0, 0, { id: "xAxis", label: "Segments", type: "string" });
      const wordRowData = createChartData(chapter.sections, wordSegments, "W");
      wordChart.value = {
        options: { title: "낱말 퀴즈 점수" },
        area,
        type: "W",
        data: { cols: wordCols, rows: wordRowData },
      };

      const senSegments = createSentenceSegment(chapter);
      const sentenceCols = senSegments.map((seg) => ({
        id: `chunk${seg.index}`,
        label: `${seg.start + 1}~${seg.end}`,
        type: "number",
      }));
      sentenceCols.splice(0, 0, {
        id: "xAxis",
        label: "Segments",
        type: "string",
      });
      const sentenceRowData = createChartData(
        chapter.sections,
        senSegments,
        "S"
      );
      sentenceChart.value = {
        options: {
          title: "문장 퀴즈 점수",
          colors: courses[props.origin].colors,
        },
        area,
        type: "S",
        data: { cols: sentenceCols, rows: sentenceRowData },
      };
    };

    const createCourseSummaryChart = () => {
      const area = getChartArea();
      const cols = [
        { id: "xAxis", label: "단계", type: "string" },
        { id: "chunk1", label: "", type: "number" },
      ];
      const wrows = props.courseStat.map((stat) => {
        const { correct, total } = stat.wordStat;
        const score = (100 * correct) / total;
        return {
          c: [
            { v: stat.desc },
            {
              v: score,
              f: `정답 ${correct}개 / 전체 ${total}개 (${score.toFixed(1)}%)`,
            },
          ],
        };
      });
      const srows = props.courseStat.map((stat) => {
        const { correct, total } = stat.senStat;
        const score = (100 * correct) / total;
        return {
          c: [
            { v: stat.desc },
            {
              v: score,
              f: `정답 ${correct}개 / 전체 ${total}개 (${score.toFixed(1)}%)`,
            },
          ],
        };
      });
      wordChart.value = {
        options: {
          title: "낱말 퀴즈 완료율",
          colors: courses[props.origin].colors,
        },
        area,
        type: "W",
        data: { cols: cols, rows: wrows },
      };
      sentenceChart.value = {
        options: {
          title: "문장 퀴즈 완료율",
          colors: courses[props.origin].colors,
        },
        area,
        type: "S",
        data: { cols: cols, rows: srows },
      };
    };

    const resetChart = () => {
      closeDetail();
      menuVisible.value = true;
      wordChart.value = sentenceChart.value = null;
      createCourseSummaryChart();
    };
    const updateArea = () => {
      const area = getChartArea();
      if (wordChart.value) {
        const { options, data, type } = wordChart.value;
        wordChart.value = { options, area, data, type };
      }
      if (sentenceChart.value) {
        const { options, data, type } = sentenceChart.value;
        sentenceChart.value = { options, area, data, type };
      }
    };
    const closeDetail = () => {
      detailRef.value = null;
    };
    const showDetail = (e) => {
      if (!activeChapter.value) {
        return;
      }
      const exam = props.exams.find((exam) => exam.seq === e.examRef);
      const section = store.getters["course/section"](exam.sectionRef);
      const { questionOffset: offset, numOfQuestions: len } = exam;
      const sentences = section.sentences.filter(
        (sen) => sen.type === e.resourceType
      );
      const score =
        (100 * exam.submissions.filter((sbm) => sbm.correct).length) / len;
      detailRef.value = {
        date: time.toYMD(exam.startTime),
        segText: `${offset + 1}~${offset + len}`,
        score: `${score.toFixed(1)}점`,
        sentences: sentences.slice(offset, offset + len),
        exams: [exam],
        section,
      };
    };
    const debouncing = () => {
      clearTimeout(timer);
      timer = setTimeout(updateArea, 300);
    };
    const showConfetti = () => {
      confettiVisible.value = true;

      nextTick().then(() => {
        const parent = canvas.value.parentElement;
        console.log(parent);
        canvas.value.width = parent.offsetWidth;
        canvas.value.height = parent.offsetHeight;
        if (!canvas.value.confetti) {
          canvas.value.confetti = confetti.create(canvas.value, {
            resizie: true,
          });
        }
        canvas.value.confetti.reset();
        let cnt = 0;
        const stop = () => {
          cnt++;
          if (cnt === 2) {
            confettiVisible.value = false;
          }
        };
        canvas.value
          .confetti({
            particleCount: 50,
            spread: 80,
            origin: { x: 0, y: 1 },
          })
          .then(stop);
        canvas.value
          .confetti({
            particleCount: 50,
            spread: 80,
            origin: { x: 1, y: 1 },
          })
          .then(stop);
      });
    };
    const getChapterTitle = (chapter) => {
      const { origin, desc } = chapter;
      if (origin === "L") {
        const p = desc.substring("x. ".length);
        const range = util.chapter.rangeText(chapter, ". ");
        return range + p;
      } else {
        return desc;
      }
    };

    watch(() => props.origin, resetChart);
    onMounted(() => {
      createCourseSummaryChart();
      resizer = new ResizeObserver(debouncing);
      resizer.observe(chartEl.value);
    });
    onUnmounted(() => {
      resizer.disconnect();
    });
    return {
      detailRef,
      chartEl,
      chapters,
      wordChart,
      sentenceChart,
      activeChapter,
      menuVisible,
      canvas,
      confettiVisible,
      showSectionChart,
      closeDetail,
      showDetail,
      showConfetti,
      getChapterTitle,
    };
  },
};
</script>

<style lang="scss" scoped>
$color: #6b7a99;
@import "~@/assets/resizer";
$active-fcolor: #7b4799;
$bgcolor: #f1e9f6;
.level-stat {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  position: relative;
  background-color: white;
  border-radius: 16px;
  overflow: hidden;
  .nav {
    background-color: $active-fcolor;
    color: white;
    h4 {
      font-size: 1.5rem;
      font-weight: 600;
      padding: 16px;
      display: flex;
      column-gap: 16px;
      align-items: center;
      margin: 0;
      .btn-back {
        transform: rotate(90deg);
        font-size: 2rem;
      }
      .label {
        flex: 1 1 auto;
      }
      .btn-exit {
        font-size: 2rem;
      }
    }
  }
  .stat-body {
    display: flex;
    flex: 1 1 auto;
    position: relative;
    .dimmer {
      display: none;
    }
    .btn-unfolding {
      position: absolute;
      z-index: 5;
      font-size: 20px;
      padding: 6px;
      background-color: gold;
      top: 0px;
      right: 8px;
      border-radius: 50%;
      box-shadow: rgb(0 0 0 / 16%) 2px 2px 4px, rgb(0 0 0 / 23%) 2px 2px 4px;
    }
    .menu {
      flex: 0 0 auto;
      padding-top: 16px;

      .menu-btn {
        display: none;
      }
      .item {
        cursor: pointer;
        display: flex;
        min-width: 200px;
        padding: 4px 8px;
        margin: 0 8px;
        border-radius: 8px;
        font-weight: 600;
        color: $color;
        &:hover {
          background-color: $bgcolor;
        }
        &.active {
          background-color: $bgcolor;
          color: $active-fcolor;
        }
        .wbar {
          width: 4px;
          flex: 0 0 8px;
        }
        .desc {
          padding: 4px 8px;
          white-space: nowrap;
          font-size: 1.25rem;
        }
      }
    }
    @include mobile {
      .dimmer {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #0000004d;
        z-index: 3;
        display: block;
      }
      .floating.menu {
        position: absolute;
        z-index: 5;
        background-color: white;
        top: 0;
        left: 0;
        bottom: 0;
        box-shadow: #26394d 0px 20px 30px -10px;
        .menu-btn {
          display: block;
        }
      }
    }
    .charts {
      flex: 1 1 auto;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      position: relative;
      .detail {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        box-shadow: 2px 2px 16px #0000004d;
        border-radius: 8px;
        overflow: hidden;
        width: 400px;
        height: 400px;

        background-color: white;
        padding: 0;

        .info {
          padding: 8px 16px;
        }
        .submits {
          position: relative;
          background-color: white;
          padding: 8px;
          overflow: auto;
          flex: 1 1 auto;
        }
        .confetti {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
        }
      }
      @include mobile {
        .detail {
          max-width: 400px;
          width: 90%;
        }
      }
      @include tablet {
        .detail {
          width: 400px;
        }
      }
      @include desktop {
        .detail {
          width: 400px;
        }
      }
    }
  }
}
</style>
