<template>
  <div class="q-result">
    <div v-if="ctx.isQuizMode()" class="left half"><ScoreView /></div>
    <div v-else-if="ctx.isListenMode()" class="left half"><AnswerView /></div>
    <div
      class="right"
      :class="[ctx.isQuizMode() || ctx.isListenMode() ? 'half' : 'one']"
    >
      <NavControllView />
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import api from "@/service/api";
import { onMounted } from "@vue/runtime-core";
import ScoreView from "./ScoreView.vue";
import AnswerView from "./AnswerView.vue";
import NavControllView from "./NavControllView.vue";
export default {
  components: {
    ScoreView,
    NavControllView,
    AnswerView,
  },
  setup() {
    const store = useStore();
    const ctx = store.state.quiz.quizContext;

    const uploadExam = () => {
      const { resourceType, ranges } = ctx;
      if (resourceType === "A" && ranges[1] === 0) {
        // 교과서 종합(랜덤) 문제이므로 서버에 업로드하지 않아야 함
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
        retry: ctx.isRetryMode(),
        submissions: null,
      };
      exam.submissions = ctx.questions.flatMap((question) => {
        return question.trials.map((trial) => {
          trial.mode = "exam";
          return trial;
        });
      });

      api.exam.submitExam(exam).then(() => {
        store.dispatch("record/loadRecord", ctx.sectionSeq);
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
        store.dispatch("record/loadRecord", ctx.sectionSeq);
      });
    };
    onMounted(() => {
      store.commit("quiz/hideHint");
      if (ctx.isListenMode() || ctx.isRetryMode()) {
        // 듣고쓰기 모드에서는 시험 결과를 업로드하지 않음.
        // 재시도인 경우 업로드하지 않음
        // 재시도인 경우에도 서버에 업로드해야 오답 정보가 업데이트 된다.
      } else if (ctx.isQuizMode() || ctx.isWord()) {
        uploadExam();
      } else {
        uploadLearning();
      }
    });
    return {
      ctx,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "~@/assets/resizer";
.q-result {
  flex: 1 1 auto;
  display: flex;

  .one {
    flex: 0 0 100%;
    position: relative;
    display: flex;
    justify-content: center;
    overflow: auto;
    height: 100%;
  }
  .half {
    flex: 0 0 50%;
    position: relative;
    display: flex;
    justify-content: center;
    overflow: auto;
    height: 100%;
  }
  .right {
    background-color: #f9f9f9;
  }
  .trials {
    flex: 1 1 auto;
  }
  @include mobile {
    flex-direction: column;
  }
}
</style>
