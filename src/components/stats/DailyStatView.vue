<template>
  <div class="daily-stat">
    <div class="summary">
      <div class="today">
        <div>
          <SpanText
            >{{ now.year }}년 {{ now.month }}월 {{ now.date }}일</SpanText
          >
        </div>
        <div>
          <SpanText>{{ now.dayText }}요일</SpanText>
        </div>
      </div>
      <div class="item">
        <h5>학습 문항</h5>
        <div class="body" v-if="todayStat">
          {{ todayStat.questions === 0 ? "---" : `${todayStat.questions}문항` }}
        </div>
      </div>
      <div class="item">
        <h5>학습 시간</h5>
        <div class="body" v-if="todayStat">{{ timeText(todayStat.times) }}</div>
      </div>
      <div class="item">
        <h5>평균 점수</h5>
        <div class="body" v-if="todayStat">{{ todayStat.score }}</div>
      </div>
    </div>
    <div class="cal-view">
      <CalendarView
        class="calendar"
        :current="new Date()"
        @today="showTodayExam"
        @exams="showExamDetail"
      />
      <div class="details" v-if="detail">
        <ExamPaperTableView
          :papers="detail.papers"
          :date="detail.day"
          @close="detail = null"
        />
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 학생 일일 통계 화면
 * - 달력 형태로 화면에 보여줌
 */
import { ref, shallowRef } from "vue";
import { time } from "@/service/util";
import { CalendarView, Day } from "../calendar";
import ExamPaperTableView from "./ExamPaperTableView.vue";
import { SpanText } from "@/components/text";
export default {
  components: {
    CalendarView,
    ExamPaperTableView,
    SpanText,
  },
  setup() {
    const now = Day.fromDate(new Date());
    const detail = shallowRef(null);
    const todayStat = ref(null);
    const showExamDetail = (e) => {
      detail.value = { ...e }; // papers, day
    };
    const showTodayExam = (papers) => {
      const stats = papers.reduce(
        (acc, paper) => {
          acc.questions += +paper.numOfQuestions;
          acc.times += paper.endTime - paper.startTime;
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
      stats.score = total === 0 ? "---" : ((100 * correct) / total).toFixed(1);
      todayStat.value = stats;
    };
    const timeText = (millis) => {
      return millis === 0 ? "---" : time.readableText(millis);
    };
    return {
      now,
      todayStat,
      detail,
      timeText,
      showExamDetail,
      showTodayExam,
    };
  },
};
</script>

<style lang="scss" scoped>
.daily-stat {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  .summary {
    display: flex;
    justify-content: flex-start;
    column-gap: 16px;
    padding: 0 16px;
    .today {
      flex: 1 1 auto;
    }
    .item {
      position: relative;
      width: 80px;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 8px;
      background-color: antiquewhite;
      border-radius: 8px;
      h5 {
        position: absolute;
        font-weight: 400;
        top: -8px;
        left: -10%;
        font-size: 1rem;
      }
      .body {
        font-size: 1.5rem;
        flex: 0 0 auto;
      }
    }
  }
  .cal-view {
    position: relative;
    display: flex;
    flex: 1 1 auto;
    .calendar {
      flex: 1 1 auto;
    }
    .details {
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      background-color: #0000004d;
      z-index: 10;
      padding: 16px;
    }
  }
}
</style>
