<template>
  <div class="daily-stat">
    <div class="cal-view">
      <div class="cal-header">
        <CalendarNav class="cal-nav" :current="now" @shift="shiftCalendar" />
        <div class="today-stat">
          <div class="item left">
            <h5><span class="prefix">학습</span> <span>문항</span></h5>
            <div class="body">
              {{ formatText(todayStat, "questions", "문항") }}
            </div>
          </div>
          <div class="item">
            <h5><span class="prefix">학습</span> <span>시간</span></h5>
            <div class="body">
              {{ timeText(todayStat) }}
            </div>
          </div>
          <div class="item right">
            <h5><span class="prefix">평균</span> <span>점수</span></h5>
            <div class="body">{{ formatText(todayStat, "score", "점") }}</div>
          </div>
        </div>
      </div>
      <CalendarView
        class="calendar"
        :current="now"
        @today="showTodayExam"
        @exams="showExamDetail"
      />
      <div
        class="details"
        v-if="detail"
        ref="detailEl"
        @click="closeDetailView"
      >
        <ExamPaperTableView
          :papers="detail.papers"
          :date="detail.day"
          @view-submissions="showSubmissions"
          @close="closeDetailView"
        />
      </div>
      <div class="submissions" v-if="submissions">
        <ActionIcon class="close" icon="close" @click="closeSubmitView" />
        <div class="scrollable" ref="scrollEl">
          <SentenceSubmissionView
            v-if="submissions.isWord"
            :paper="submissions.paper"
            :section="submissions.section"
            @perfect="showConfetti"
          />
          <EojeolSubmissionView
            v-else
            :paper="submissions.paper"
            :section="submissions.section"
            @perfect="showConfetti"
          />
        </div>
        <canvas v-if="confettiVisible" class="confetti" ref="canvas"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 학생 일일 통계 화면
 * - 달력 형태로 화면에 보여줌
 */
import { nextTick, ref, shallowRef } from "vue";
import { time } from "@/service/util";
import { CalendarNav, CalendarView, Day, fromDate } from "../calendar";
import ExamPaperTableView from "./ExamPaperTableView.vue";
import EojeolSubmissionView from "../quiz/submission/EojeolSubmissionView.vue";
import SentenceSubmissionView from "../quiz/submission/SentenceSubmissionView.vue";
import { ActionIcon } from "../../components/form";
import confetti from "canvas-confetti";

export default {
  components: {
    ActionIcon,
    CalendarNav,
    CalendarView,
    ExamPaperTableView,
    SentenceSubmissionView,
    EojeolSubmissionView,
  },
  setup() {
    let current = new Date(); // (new Date().getTime() - 1 * 24 * 60 * 60 * 1000);
    const now = shallowRef(Day.fromDate(current));
    const detailEl = shallowRef(null);
    const detail = shallowRef(null);
    const submissions = shallowRef(null);
    const todayStat = ref(null);
    const scrollEl = ref(null);
    const canvas = ref(null);
    const confettiVisible = ref(false);
    const showExamDetail = (e) => {
      detail.value = { ...e }; // papers, day
    };
    const showTodayExam = (papers) => {
      const stats = papers.reduce(
        (acc, paper) => {
          acc.questions += +paper.numOfQuestions;
          acc.times += Date.parse(paper.endTime) - Date.parse(paper.startTime);
          if (paper.mode === "Q") {
            acc.quiz.total += paper.numOfQuestions;
            acc.quiz.correct += paper.submissions.filter(
              (submit) => submit.correct
            ).length;
          }
          return acc;
        },
        { questions: 0, times: 0, quiz: { total: 0, correct: 0 } }
      );
      const { total, correct } = stats.quiz;
      stats.score = total === 0 ? null : ((100 * correct) / total).toFixed(1);
      todayStat.value = stats;
    };
    const timeText = (stat) => {
      return stat ? time.readableText(stat.times) : "---";
    };
    const showSubmissions = (pair) => {
      const { paper, section } = pair;

      const isWord = paper.type === "W" || paper.mode === "Q";
      submissions.value = { isWord, paper, section };
      nextTick().then(() => {
        scrollEl.value.scrollTop = 0;
        detailEl.value.addEventListener("click", closeSubmitView, false);
      });
    };

    const closeSubmitView = () => {
      confettiVisible.value = false;
      detailEl.value.removeEventListener("click", closeSubmitView, false);
      submissions.value = null;
    };
    const closeDetailView = () => {
      closeSubmitView();
      detail.value = null;
    };
    const showConfetti = () => {
      confettiVisible.value = true;
      nextTick().then(() => {
        canvas.value.width = 400;
        canvas.value.height = 400;
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

    const shiftMonth = (delta) => {
      const d = fromDate(now.value);
      const newMonth = delta === 1 ? d.nextMonth() : d.prevMonth();
      now.value = newMonth;
    };
    const formatText = (stat, prop, suffix) => {
      return stat && stat[prop] ? `${Math.floor(stat[prop])}${suffix}` : "---";
    };
    const shiftCalendar = (cal) => {
      const { type, by } = cal;
      if (type === "month") {
        shiftMonth(by);
      } else if (type === "today") {
        current = new Date();
        now.value = fromDate(Day.fromDate(current));
      }
    };
    return {
      current,
      now,
      todayStat,
      detail,
      detailEl,
      scrollEl,
      submissions,
      canvas,
      confettiVisible,
      timeText,
      showExamDetail,
      showTodayExam,
      showSubmissions,
      closeSubmitView,
      closeDetailView,
      showConfetti,
      formatText,
      shiftCalendar,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
.daily-stat {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  background-color: white;
  border-radius: 16px;
  height: 100%;
  .summary {
    display: flex;
    justify-content: flex-start;
    column-gap: 16px;
    padding: 0 16px;
    margin: 16px 0;
  }
  .cal-view {
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    .cal-header {
      display: flex;
      padding: 16px 8px;
      color: #6b7a99;
      .cal-nav {
        flex: 1 1 auto;
      }
      .today-stat {
        border-radius: 40rem;
        border: 2px solid #7b4799;
        overflow: hidden;
        display: flex;
        font-weight: 600;
        .item {
          position: relative;
          display: flex;
          // padding: 8px;
          background-color: white;
          color: #7b4799;
          font-size: 1.2rem;
          h5 {
            display: flex;
            align-items: center;
            font-weight: 600;
            padding: 0 16px;
            font-size: 1.2rem;
            white-space: nowrap;
            width: 90px;
          }
          .body {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #7b4799;
            color: white;
            width: 80px;
          }
        }
      }
      @media (max-width: 860px) {
        .today-stat {
          height: 36px;
          margin-right: 16px;
          .item {
            // padding: 0 16px;
            h5 {
              width: auto;
              padding: 8px;
              .prefix {
                display: none;
              }
            }
            .body {
              width: auto;
              padding: 8px;
            }
          }
        }
      }
      @media (max-width: 660px) {
        flex-direction: column;
        row-gap: 16px;
        .today-stat {
          display: flex;
          margin: 0 12px;
          .item {
            flex: 1 0 auto;
            // padding: 0 16px;
            h5 {
              display: none;
            }
            .body {
              width: 100%;
              padding: 8px;
            }
          }
        }
      }
    }
  }
  .calendar {
    flex: 1 1 auto;
  }
  .details {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 10;
    background-color: #ffffffad;
  }
  .submissions {
    display: flex;
    flex-direction: row;
    position: absolute;
    top: 50%;
    left: 50%;
    height: 400px;
    z-index: 20;
    transform: translate(-50%, -50%);
    box-shadow: 2px 2px 16px #0000004d;
    border-radius: 8px;
    overflow: hidden;
    .scrollable {
      position: relative;
      background-color: white;
      padding: 18px 0;
      overflow: auto;
      flex: 1 1 auto;
    }
    .close {
      position: absolute;
      top: 8px;
      right: 8px;
      font-size: 32px;
      z-index: 30;
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
    .submissions {
      max-width: 400px;
      width: 90%;
    }
  }
  @include tablet {
    .submissions {
      width: 400px;
    }
  }
  @include desktop {
    .submissions {
      width: 400px;
    }
  }
}
</style>
