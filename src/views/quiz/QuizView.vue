<template>
  <div class="quiz-wrapper">
    <input
      type="search"
      tabindex="-1"
      ref="focusing"
      autocomplete="off"
      enterkeyhint="done"
      @keyup="hideReward"
    />
    <template v-if="ctx">
      <Numbering />
      <div class="question">
        <component
          :is="ctx.options.questionComponent"
          :quizContext="ctx"
          :fillHeight="true"
          @speaking="sceneClicked"
        />
        <ActionIcon
          v-if="!ctx.isQuizMode() && ctx.currentQuestion.hasPrevQuiz()"
          class="icon left"
          icon="chevron_left"
          @click.stop.prevent="moveQuiz(-1)"
        />
        <template v-if="!ctx.isQuizMode()">
          <ActionIcon
            v-if="ctx.currentQuestion.hasNextQuiz()"
            class="icon right"
            icon="chevron_right"
            @click.stop.prevent="moveQuiz(1)"
          />
          <ActionIcon
            v-else
            class="icon right"
            icon="last_page"
            @click.stop.prevent="alertForResult"
          />
        </template>
        <div class="sentence-view" v-if="ctx.isReadingMode()" @click="speak">
          <h3>{{ ctx.currentQuestion.text }}</h3>
        </div>
        <HintView v-if="hint.visible" />
      </div>
      <div class="answer">
        <component
          :is="ctx.options.answerComponent"
          :quizContext="ctx"
          :question="ctx.currentQuestion"
          :fillHeight="false"
          @quizEnd="alertForResult"
        />
      </div>
    </template>
    <div class="none" v-else>NONE</div>
    <RewardView v-if="reward" />
    <transition name="pop">
      <TtsView v-if="speaking" />
    </transition>
    <QuizResult v-if="quizFinished" />
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted, ref } from "@vue/runtime-core";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import quizStore from "./quizStore";
import quiz from "@/views/quiz";
import { useStore } from "vuex";
import ActionIcon from "@/components/form/ActionIcon.vue";
import Numbering from "@/views/quiz/Numbering.vue";
import HintView from "./HintView.vue";
import RewardView from "./RewardView.vue";
import TtsView from "./TtsView.vue";
import QuizResult from "./result/QuizResult.vue";
import { tts } from "@/components/tts";
export default {
  components: {
    ActionIcon,
    Numbering,
    HintView,
    RewardView,
    TtsView,
    QuizResult,
  },
  setup() {
    const store = useStore();
    const ctx = computed(() => store.state.quiz.quizContext);
    const hint = computed(() => store.state.quiz.hint);
    const reward = computed(() => store.getters["ui/reward"]);
    const speaking = computed(() => store.state.tts.speaking);
    const focusing = ref(null);
    const keyConsumer = ref(null);
    const quizFinished = computed(() => store.state.quiz.finished);
    const router = useRouter();
    store.commit("quiz/hideHint");
    quiz.loadQuiz();
    /**
     * 모바일에서 soft keyboard가 내려갔다 올라가는 불편을 방지하기 위해서
     * dummy로 집어넣은 inpupt[type=text]에 포커스를 옮겨둠.
     */
    const holdSoftKeyboard = () => focusing.value.focus();

    const moveQuiz = (dir) => {
      // if (!ctx.value.isReadingMode()) {
      //   holdSoftKeyboard();
      // }
      if (dir > 0) {
        quizStore.moveNext();
      } else {
        quizStore.movePrev();
      }
      // holdSoftKeyboard();
    };
    const alertForResult = () => {
      if (ctx.value.isReadingMode()) {
        router.replace({
          name: ctx.value.prevPage,
        });
      } else {
        const yes = window.confirm("결과 화면으로 이동합니까?");
        if (yes) {
          moveQuiz(1);
        }
      }
    };
    const speak = () => {
      return tts.speak(ctx.value.currentQuestion.text);
    };
    const sceneClicked = () => {
      // if (!ctx.value.isReadingMode()) {
      //   }
      holdSoftKeyboard();
    };
    onBeforeRouteLeave(() => {
      // console.log(`${from.fullPath} -> ${to.fullPath}`);
      // if (!quizFinished.value) {
      //   // const exitQuiz = confirm("퀴즈를 종료합니까?");
      //   // if (exitQuiz) {
      //   //   }
      //   store.commit("quiz/closeQuiz");
      //   return true;
      // } else {
      //   }
      store.commit("quiz/closeQuiz");
      return true;
    });
    onMounted(() => {
      store.commit("ui/hideReward");
      store.commit("ui/setBackgroundVisible", false);
      store.commit("ui/setNavSize", { expanded: false, topPadding: 56 });
    });
    onUnmounted(() => {
      store.commit("ui/setBackgroundVisible", true);
      store.commit("ui/setNavSize", { expanded: true, topPadding: 120 });
    });
    return {
      ctx,
      hint,
      reward,
      focusing,
      keyConsumer,
      quizFinished,
      speaking,
      moveQuiz,
      alertForResult,
      sceneClicked,
      holdSoftKeyboard,
      speak,
    };
  },
};
</script>

<style lang="scss" scoped>
.quiz-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  > input[type="search"] {
    position: absolute;
    width: 0;
    height: 0;
    padding: 0;
    outline: none;
    border: none;
    background-color: transparent;
    top: -1px;
    left: -1px;
  }
  .question {
    flex: 3 3;
    display: flex;
    flex-direction: column;
    position: relative;
    .icon {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      font-size: 3.5rem;
      z-index: 5;
      background-color: #ffffffcc;
      border-radius: 4rem;
      color: #666;
      box-shadow: rgb(0 0 0 / 25%) 0px 0.0625em 0.0625em,
        rgb(0 0 0 / 25%) 0px 0.125em 0.5em,
        rgb(255 255 255 / 10%) 0px 0px 0px 1px inset;
      &.left {
        left: 20px;
      }
      &.right {
        right: 20px;
      }
    }
  }
  .answer {
    flex: 0 1 auto;
    display: flex;
    // padding: 16px;
    justify-content: center;
    // overflow-x: auto;
  }
  .sentence-view {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, -16px);
    text-align: center;
    padding: 8px 16px;
    margin: 8px;
    color: #007bff;
    cursor: pointer;
    background-color: white;
    border-radius: 3rem;
    box-shadow: 1px 1px 4px #0000004d;
    h3 {
      font-size: 2rem;
      line-height: 1.2;
    }
  }
  .pop-enter-from,
  .pop-leave-to {
    opacity: 0;
  }
  .pop-enter-active,
  .pop-leave-active {
    transition: opacity 0.2s cubic-bezier(0, 0, 0.3, 1.33);
  }
}
</style>
