<template>
  <div class="histories row" v-if="histories.length > 0">
    <div class="col-12">
      <h3>오늘</h3>
    </div>
    <div
      class="col-6 col-sm-6 col-md-4 col-lg-3 section-outer"
      v-for="history in histories"
      :key="history.uuid"
    >
      <div
        class="quiz-elem"
        :class="history.theme"
        @click="$emit('itemClicked', history.section)"
      >
        <ActionIcon
          class="btn-close"
          icon="close"
          @click.stop="deleteHistory(history)"
        />
        <ParaText class="desc">
          <SpanText>{{ history.levelText }}</SpanText
          ><SpanText size="sm">{{ history.desc }}</SpanText>
        </ParaText>
        <ParaText class="lat">{{ history.lacText(cur) }}전</ParaText>
        <div class="stats">
          <div>
            <SpanText size="sm">낱말</SpanText>
            <div class="progress">
              <div class="bar" :style="{ width: history.ratio('word') }"></div>
              <SpanText class="text" size="sm"
                >{{ history.stats.word.solved }} /
                {{ history.stats.word.total }}</SpanText
              >
            </div>
          </div>
          <div>
            <SpanText size="sm">문장</SpanText>
            <div class="progress">
              <div
                class="bar"
                :style="{ width: history.ratio('sentence') }"
              ></div>
              <SpanText class="text" size="sm"
                >{{ history.stats.sentence.solved }} /
                {{ history.stats.sentence.total }}</SpanText
              >
            </div>
          </div>
        </div>
      </div>
      <!-- <SectionButton
        :item="section"
        :idx="section.level"
        @itemClicked="$emit('itemClicked', section)"
        theme="pink"
      /> -->
    </div>
  </div>
</template>

<script>
import { ParaText, SpanText } from "@/components/text";
import { ActionIcon } from "@/components/form";
// import SectionButton from "@/components/SectionButton.vue";
import { quizDao } from "@/dao";
import quizHistory from "@/dao/section-history";
// import { time } from "@/service/util";
import { ref } from "@vue/reactivity";
import { useStore } from "vuex";
import { computed } from "@vue/runtime-core";

export default {
  components: {
    ActionIcon,
    ParaText,
    SpanText,
    // SectionButton,
  },
  props: ["origin"],
  setup(props) {
    const cur = new Date();
    const store = useStore();
    const license = computed(() => store.getters["exam/activeLicense"]);
    const histories = ref([]);
    const sections = store.getters["course/sections"];

    const deleteHistory = (sectionHistory) => {
      quizDao
        .deleteBySection({
          license: license.value.uuid,
          sectionSeq: sectionHistory.sectionSeq,
        })
        .then((res) => {
          console.log(res);
          const idx = histories.value.findIndex(
            (elem) => elem === sectionHistory
          );
          histories.value.splice(idx, 1);
        });
    };
    quizHistory
      .createHistories(props.origin, license.value.uuid, sections)
      .then((res) => {
        histories.value.push(...res.histories);
      });

    return { cur, license, histories, deleteHistory };
  },
};
</script>

<style lang="scss" scoped>
.histories {
  .quiz-elem {
    padding: 6px 6px 6px 12px;
    margin-bottom: 20px;
    border-radius: 8px;
    font-family: "Rowdies", cursive, sans-serif;
    position: relative;
    cursor: pointer;
    .btn-close {
      position: absolute;
      top: 0;
      right: 0;
      transform: translate(45%, -50%);
      font-size: 24px;
      display: flex;
      border-radius: 12px;
    }
    &.pink {
      color: var(--aac-color-pink-900);
      background-color: #ffe1ea;
      box-shadow: 4px 4px var(--aac-color-pink-500);
      &:active {
        top: 2px;
        left: 2px;
        box-shadow: 2px 2px var(--aac-color-pink-500);
      }
      .btn-close {
        background-color: var(--aac-color-pink-900);
        color: var(--aac-color-pink-200);
      }
      .stats {
        .progress {
          background-color: #fbd0de;
          .bar {
            background-color: #f4abc4;
          }
        }
      }
    }
    &.green {
      color: var(--aac-color-green-900);
      background-color: var(--aac-color-green-400);
      box-shadow: 4px 4px var(--aac-color-green-700);
      &:active {
        top: 2px;
        left: 2px;
        box-shadow: 2px 2px var(--aac-color-green-700);
      }
      .btn-close {
        background-color: var(--aac-color-green-900);
        color: var(--aac-color-green-400);
      }
      .stats {
        .progress {
          background-color: #e7efa0;
          .bar {
            background-color: var(--aac-color-green-700);
          }
        }
      }
    }
    .desc {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      span + span {
        margin-left: 8px;
      }
    }
    .lat {
      text-align: right;
      margin: 2px;
      font-family: "Noto Sans KR", Avenir, Helvetica, Arial, sans-serif;
      font-size: 12px;
    }
    .stats {
      display: flex;
      flex-direction: column;
      row-gap: 4px;
      & > div {
        display: flex;
        column-gap: 8px;
        align-items: center;
        .progress {
          flex: 1 1 auto;

          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          border-radius: 4px;
          overflow: hidden;
          .bar {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
          }
          .text {
            position: relative;
            font-size: 0.9rem;
            padding: 2px 0;
          }
        }
      }
    }
  }
}
</style>
