<template>
  <div class="q-result">
    <div class="result-nav">
      <h3>{{ sectionTitle() }}</h3>
      <div class="chart-view">
        <StaticButton
          class="tab-item"
          text="시험 결과"
          @click="chart = 'CUR'"
        />
        <StaticButton
          class="tab-item"
          text="전체 결과"
          @click="chart = 'SECTION'"
        />
      </div>
    </div>
    <div class="ready" v-if="chart === 'UPLOADING'">
      <h3>결과 화면 준비중</h3>
    </div>
    <template v-else-if="chart === 'CUR'">
      <WordExamResult
        v-if="ctx.isWord()"
        :ctx="ctx"
        :maxTrial="maxTrial"
        :getTrialAt="getTrialAt"
        :answerClass="answerClass"
      />
      <SentenceExamResult
        v-else-if="ctx.isSentence()"
        :ctx="ctx"
        :maxTrial="maxTrial"
        :getTrialAt="getTrialAt"
        :answerClass="answerClass"
      />
    </template>
    <SectionHeatMapChart v-else-if="chart == 'SECTION'"></SectionHeatMapChart>
    <div class="footer">
      <AacButton text="완료" theme="blue" inline @click="closeQuiz" />
    </div>
  </div>
</template>

<script>
// import { TableView, Row, Cell } from "@/components/table";
// import { SpanText } from "@/components/text";
import WordExamResult from "./WordExamResult.vue";
import SentenceExamResult from "./SentenceExamResult.vue";
import { SectionHeatMapChart } from "../chart";
import { AacButton, StaticButton } from "@/components/form";
import { useStore } from "vuex";
import api from "@/service/api";
import { useRouter } from "vue-router";
import { nextTick, onMounted, ref } from "@vue/runtime-core";
export default {
  components: {
    SentenceExamResult,
    WordExamResult,
    AacButton,
    StaticButton,
    SectionHeatMapChart,
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const chart = ref("UPLOADING");
    const ctx = store.state.quiz.quizContext;
    const { questions } = ctx;
    const maxTrial = questions.reduce(
      (max, q) => Math.max(q.trials.length, max),
      0
    );
    console.log("d", ctx.config);
    const getTrialAt = (question, index) => {
      if (question.trials.length === 0) {
        return "-";
      }
      const trial = question.trials[index];
      return trial ? trial.value : "";
    };
    const answerClass = (question, index) => {
      const trial = question.trials[index];
      return trial ? "" + trial.correct : "";
    };
    const sectionTitle = () => {
      const section = store.getters["course/section"](
        questions[0].data.sectionRef
      );
      return section.description;
    };
    const uploadExam = () => {
      const exam = {
        license: ctx.license.uuid,
        sectionRef: ctx.sectionSeq,
        startTime: ctx.startTime / 1000,
        endTime: new Date().getTime() / 1000,
        type: ctx.isWord() ? "W" : "S",
        submissions: null,
      };
      exam.submissions = ctx.questions.flatMap((question) => {
        return question.trials.map((trial) => {
          trial.mode = "exam";
          return trial;
        });
      });

      api.exam.submitExam(exam).then(() => {
        chart.value = "CUR";
      });
    };
    const uploadLearning = () => {
      const exam = {
        license: ctx.license.uuid,
        type: ctx.isWord() ? "W" : "S",
        submissions: null,
      };
      if (ctx.isWord()) {
        // 문장에 입력된 답안을 어절로 이동시킴
        // 문장퀴즈에서는 어절에 입력됨
        ctx.questions.forEach((q) => {
          const ej = q.eojeols[0];
          q.trials.forEach((trial) => {
            trial.eojeolRef = ej.eojeolRef;
            delete trial.sentenceRef;
          });
          q.eojeols[0].trials = q.trials;
        });
      }

      const trials = ctx.questions.flatMap((question) => {
        return question.eojeols.flatMap((ej) => ej.trials);
      });
      exam.submissions = trials;
      api.exam.submitLearning(exam).then(() => {
        chart.value = "CUR";
      });
    };
    const closeQuiz = () => {
      router.replace({
        name: ctx.prevPage,
      });
      nextTick().then(() => {
        store.commit("quiz/closeQuiz");
      });
    };
    onMounted(() => {
      if (ctx.isQuizMode()) {
        uploadExam();
      } else if (ctx.isLearningMode()) {
        uploadLearning();
      }
    });
    return {
      ctx,
      chart,
      questions,
      maxTrial,
      getTrialAt,
      answerClass,
      sectionTitle,
      closeQuiz,
    };
  },
};
</script>
<style lang="scss" scoped>
.q-result {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  z-index: 10;
  display: flex;
  flex-direction: column;
  .result-nav {
    display: flex;
    align-items: center;
    h3 {
      flex: 1 1 auto;
    }
    .chart-view {
      display: flex;
      font-size: 1.3rem;
      .tab-item {
        padding: 0.25rem 0.6rem;
      }
    }
  }
  .trials {
    flex: 1 1 auto;
    overflow: auto;
  }
}
</style>