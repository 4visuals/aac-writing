<template>
  <div class="q-result">
    <div v-if="ctx.isQuizMode()" class="half"><ScoreView /></div>
    <div :class="{ half: ctx.isQuizMode() }"><NavControllView /></div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import api from "@/service/api";
import { useRouter } from "vue-router";
import { nextTick, onMounted, ref } from "@vue/runtime-core";
import ScoreView from "./ScoreView.vue";
import NavControllView from "./NavControllView.vue";
export default {
  components: {
    ScoreView,
    NavControllView,
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
    const getTrialAt = (question, index) => {
      if (question.trials.length === 0) {
        return "-";
      }
      const trial = question.trials[index];
      return (trial && (trial.value || "미입력")) || "미입력";
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
      const { resourceType, ranges } = ctx;
      if (resourceType === "A" && ranges[1] === 0) {
        // 교과서 종합(랜덤) 문제이므로 서버에 업로드하지 않아야 함
        chart.value = "CUR";
        return;
      }
      const mode = ctx.mode;
      const exam = {
        license: ctx.license.uuid,
        sectionRef: ctx.sectionSeq,
        startTime: ctx.startTime / 1000,
        endTime: new Date().getTime() / 1000,
        type: ctx.isWord() ? "W" : "S",
        mode: mode.substring(0, 1),
        questionOffset: ctx.ranges[0],
        numOfQuestions: ctx.quizLength,
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
    /**
     * [문장] 어절 단위로 입력받음
     * [낱말] 한 어절짜리 문장으로 취급. 학생의 입력을 어절로 이동시킴.
     *
     */
    const uploadLearning = () => {
      const mode = ctx.mode;
      const exam = {
        license: ctx.license.uuid,
        sectionRef: ctx.sectionSeq,
        startTime: ctx.startTime / 1000,
        endTime: new Date().getTime() / 1000,
        type: ctx.isWord() ? "W" : "S",
        mode: mode.substring(0, 1),
        questionOffset: ctx.ranges[0],
        numOfQuestions: ctx.quizLength,
        submissions: null,
      };
      if (ctx.isWord()) {
        // 문장에 입력된 답안을 어절로 이동시킴
        // 문장퀴즈에서는 어절에 입력됨
        ctx.questions.forEach((q) => {
          const ej = q.eojeols[0];
          q.trials.forEach((trial) => {
            trial.eojeolRef = ej.eojeolRef;
            trial.sentenceRef;
          });
          q.eojeols[0].trials = q.trials;
        });
      } else {
        ctx.questions.forEach((q) => {
          q.eojeols.forEach((ej) => {
            ej.trials.forEach((trial) => {
              trial.sentenceRef = ej.sentenceRef;
            });
          });
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
      store.commit("quiz/hideHint");
      if (ctx.isQuizMode() || ctx.isWord()) {
        uploadExam();
      } else {
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
  flex: 1 1 auto;
  display: flex;

  .half {
    flex: 0 0 50%;
    position: relative;
    display: flex;
    overflow: auto;
    height: 100%;
  }
  .trials {
    flex: 1 1 auto;
    overflow: auto;
  }
}
</style>
