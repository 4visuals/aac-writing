<template>
  <div class="numbering" :class="[theme]">
    <div class="desc text-ellipsis">
      <p class="text-ellipsis">{{ rss }} {{ desc }}</p>
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
          {{ q.numberInSection + 1 }}
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
import { QuizModeText } from "./index";

export default {
  props: ["theme"],
  setup() {
    const rssTypeMap = {
      W: "낱말",
      S: "문장",
      A: "교과서",
    };
    const store = useStore();
    const ctx = computed(() => store.state.quiz.quizContext);
    const currentQuestion = computed(() => store.getters["quiz/currentPara"]);
    const desc = QuizModeText[ctx.value.mode];
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
  align-items: stretch;
  column-gap: 16px;
  margin: 0 10%;
  font-size: 2rem;
  font-weight: 600;
  position: relative;
  padding: 16px 0;
  @include mobile {
    margin: 0 16px;
    font-size: 14px;
    padding: 8px 0;
  }

  &.word {
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
  &.sentence {
    color: #21c2cc;
    .desc {
      .speaker {
        background-color: #21c2cc;
      }
    }
    .bars {
      .current.elem {
        color: #21c2cc;
        .bar {
          background-color: #21c2cc;
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
  &.trial {
    color: #ff114a;
    .desc {
      .speaker {
        background-color: #ff114a;
      }
    }
    .bars {
      .current.elem {
        color: #ff114a;
        .bar {
          background-color: #ff114a;
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
      background-size: contain;
      mask-image: url("/img/speaker.svg");
      width: 32px;
      height: 32px;
      mask-size: contain;
      @include mobile {
        width: 24px;
        height: 24px;
      }
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
      .num {
        font-size: 16px;
        @include mobile {
          font-size: 12px;
        }
      }
      .bar {
        height: 10px;
        width: 100%;
        background-color: $inactive-bgc;
      }
    }
  }
  .scrollable {
    display: flex;
    column-gap: 8px;

    overflow-x: auto;
  }
}
</style>
