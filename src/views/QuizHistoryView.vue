<template>
  <div class="histories" v-if="histories.length > 0">
    <div
      v-for="history in histories"
      :key="history.uuid"
      class="quiz-elem"
      :class="history.theme"
      @click="$emit('itemClicked', history.section)"
    >
      <SpanText class="label text-ellipsis">학습중</SpanText>
      <AppButton
        size="chapter"
        :invert="!history.isChallengeSection()"
        :transparent="true"
        :borderColor="history.isChallengeSection() ? '#FFD110' : ''"
        :theme="history.isChallengeSection() ? 'yellow' : history.theme"
        :text="getChapterText(history.section)"
      ></AppButton>
      <ParaText class="desc">
        <SpanText>{{ history.desc }}</SpanText>
      </ParaText>
      <div class="stats">
        <div v-if="!history.isChallengeSection()" class="each">
          <SpanText class="text" size="sm">낱말</SpanText>
          <SpanText class="text" size="sm"
            >{{ history.stats.word.solved }} /
            {{ history.stats.word.total }}</SpanText
          >
        </div>
        <div class="each">
          <SpanText class="text" size="sm">문장</SpanText>
          <SpanText class="text" size="sm"
            >{{ history.stats.sentence.solved }} /
            {{ history.stats.sentence.total }}</SpanText
          >
        </div>
      </div>
      <ParaText class="lat text-ellipsis"
        >{{ history.lacText(cur) }}전</ParaText
      >
      <ActionIcon
        class="btn-close"
        icon="cancel"
        @click.stop="deleteHistory(history)"
      />
    </div>
  </div>
</template>

<script>
import { ParaText, SpanText } from "@/components/text";
import { ActionIcon } from "@/components/form";
import { quizDao } from "@/dao";
import quizHistory from "@/dao/section-history";
import { ref } from "@vue/reactivity";
import { useStore } from "vuex";
import { computed } from "@vue/runtime-core";
import util from "../service/util";
import { AppButton } from "../components/form";

export default {
  components: {
    ActionIcon,
    ParaText,
    SpanText,
    AppButton,
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

    const getChapterText = (section) => {
      if (section.level < 0) {
        return "도전";
      } else {
        return util.chapter.rangeText(section.chapter, " 단계");
      }
    };
    quizHistory
      .createHistories(props.origin, license.value.uuid, sections)
      .then((res) => {
        histories.value.push(...res.histories);
      });

    return { cur, license, histories, deleteHistory, getChapterText };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
.histories {
  margin-bottom: 17px;
  .quiz-elem {
    display: flex;
    align-items: center;
    column-gap: 12px;
    padding: 5px 10px 5px 24px;
    margin-bottom: 12px;
    border-radius: 40px;
    font-family: Rowdies, monospace, cursive, sans-serif;
    position: relative;
    cursor: pointer;
    .btn-close {
      font-size: 32px;
      border-radius: 16px;
    }
    &.blue {
      color: white;
      background-color: #4b7bec;
      &:active {
        top: 2px;
        left: 2px;
      }
      .btn-close {
        color: white;
      }
    }
    &.purple {
      color: white;
      background-color: #8971bd;
      &:active {
        top: 2px;
        left: 2px;
      }
      .btn-close {
        color: white;
      }
    }
    &.pink {
      color: var(--aac-color-pink-900);
      background-color: #ffe1ea;
      &:active {
        top: 2px;
        left: 2px;
      }
      .btn-close {
        background-color: var(--aac-color-pink-900);
        color: var(--aac-color-pink-200);
      }
    }
    &.green {
      color: var(--aac-color-green-900);
      background-color: var(--aac-color-green-400);
      &:active {
        top: 2px;
        left: 2px;
      }
      .btn-close {
        background-color: var(--aac-color-green-900);
        color: var(--aac-color-green-400);
      }
    }
    .desc {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      flex: 1 1 auto;
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
      column-gap: 8px;
      & > .each {
        flex: 1;
        display: flex;
        column-gap: 2px;
        align-items: center;
        .text {
          flex: 1 1 auto;
          white-space: nowrap;
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
  @include mobile {
    .quiz-elem {
      padding: 4px;
      .label {
        display: none;
      }
    }
  }
}
</style>
