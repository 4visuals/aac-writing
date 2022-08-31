<template>
  <div class="numbering">
    <div class="bar done"></div>
    <div class="bar todo"></div>
    <div
      class="dot"
      v-for="q in ctx.questions"
      :key="q.index"
      :style="{
        left: `${(q.index / (ctx.questions.length - 1)) * 100}%`,
      }"
    ></div>
    <div
      v-if="currentQuestion"
      class="current num"
      :style="{
        left: `${(currentQuestion.index / (ctx.questions.length - 1)) * 100}%`,
      }"
    >
      {{ currentQuestion.index + 1 }}
    </div>
    <!-- <div
        class="num"
        :class="{ current: currentQuestion === q }"
        v-for="q in questions"
        :key="q.index"
      >
        {{ q.index + 1 }}
      </div> -->
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
// import quizStore from "./quizStore";

export default {
  setup() {
    const store = useStore();
    const ctx = computed(() => store.state.quiz.quizContext);

    const currentQuestion = computed(() => store.getters["quiz/currentPara"]);
    // const questions = shallowRef(ctx.value.questions);
    return {
      ctx,
      currentQuestion,
      // len: questions.length,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
$bdrc: rgb(22, 95, 0);
$bgc: transparent;
$dot-color: rgb(95, 172, 8);
$active-bgc: rgb(22, 95, 0);
$active-fgc: white;

.numbering {
  display: flex;
  margin: 0 32px 8px;
  font-size: 1.2rem;
  position: relative;
  .bar {
    position: absolute;
    height: 6px;
    background-color: rgb(189, 247, 81);
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }
  .dot {
    position: absolute;
    top: 50%;
    width: 6px;
    height: 6px;
    transform: translate(-3px, -3px);
    border-radius: 2px;
    background-color: $dot-color;
  }
  .num {
    border: 1px solid $bdrc;
    border-radius: 3vmin;

    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    top: 0;
    z-index: 5;
    transform: translateX(-50%);
    transition: left 0.2s cubic-bezier(0.39, 0.58, 0.57, 1);
    &.current {
      background-color: $active-bgc;
      color: $active-fgc;
    }
  }
  @include mobile {
    .num {
      font-size: 3vmin;
      width: 6vmin;
      height: 6vmin;
    }
  }
  @include tablet {
    .num {
      font-size: 2.5vmin;
      width: 5vmin;
      height: 5vmin;
    }
  }
  @include desktop {
    .num {
      font-size: 2.5vmin;
      width: 5vmin;
      height: 5vmin;
    }
  }
  .scrollable {
    display: flex;
    column-gap: 8px;

    overflow-x: auto;
  }
}
</style>
