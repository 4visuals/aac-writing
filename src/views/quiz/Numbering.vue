<template>
  <div class="numbering" :class="[theme.name]">
    <div class="desc">
      <p>{{ rss }} {{ desc }}</p>
      <button class="nude speaker" @click="$emit('speak')"></button>
    </div>
    <div class="bars">
      <div
        v-for="q in ctx.questions"
        :key="q.index"
        class="elem"
        :class="{ current: q.index <= currentQuestion.index }"
      >
        <div v-if="q.index <= currentQuestion.index" class="num">
          {{ q.offsetInSection + 1 }}
        </div>
        <div v-else class="num"></div>
        <div class="bar"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
// import quizStore from "./quizStore";

export default {
  props: ["theme"],
  setup() {
    const descMap = {
      READING: "보고쓰기",
      LEARNING: "연습하기",
      QUIZ: "받아쓰기",
    };
    const rssTypeMap = {
      W: "낱말",
      S: "문장",
      A: "교과서",
    };
    const store = useStore();
    const ctx = computed(() => store.state.quiz.quizContext);
    const currentQuestion = computed(() => store.getters["quiz/currentPara"]);
    const desc = descMap[ctx.value.mode];
    const rss = rssTypeMap[ctx.value.resourceType];
    return {
      ctx,
      desc,
      rss,
      currentQuestion,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
$bgc: transparent;
$active-bgc: #4840ee;
$inactive-bgc: #eee9fe;

.numbering {
  display: flex;
  align-items: center;
  margin: 0 10%;
  font-size: 2rem;
  font-weight: 600;
  position: relative;
  padding: 16px 0;

  &.blue {
    color: #3867d6;
    .desc {
      .speaker {
        background-color: #45aaf2;
      }
    }
    .bars {
      .current.elem {
        color: #4840ee;
        .bar {
          background-color: #4840ee;
        }
      }
    }
  }
  &.brown {
    color: #865900;
    .desc {
      .speaker {
        background-color: #865900;
      }
    }
    .bars {
      .current.elem {
        color: #865900;
        .bar {
          background-color: #865900;
        }
      }
    }
  }
  .desc {
    flex: 1 1 50%;
    display: flex;
    align-items: center;
    column-gap: 8px;
    .speaker {
      width: 32px;
      height: 32px;
      background-size: contain;
      mask-image: url("/img/speaker.svg");
    }
  }
  .bars {
    flex: 1 1 50%;
    display: flex;
    justify-content: center;
    column-gap: 3px;
    .elem {
      flex: 1 1 10%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      color: $inactive-bgc;
      font-weight: 600;
      user-select: none;
      &.current {
        color: $active-bgc;
        .bar {
          background-color: $active-bgc;
        }
      }
      .bar {
        height: 10px;
        width: 100%;
        background-color: $inactive-bgc;
      }
    }
  }

  @include mobile {
    .num {
      font-size: 16px;
    }
  }
  @include tablet {
    .num {
      font-size: 16px;
    }
  }
  @include desktop {
    .num {
      font-size: 16px;
    }
  }
  .scrollable {
    display: flex;
    column-gap: 8px;

    overflow-x: auto;
  }
}
</style>
