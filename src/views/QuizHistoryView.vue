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
      <ParaText class="lat">{{ history.lacText(cur) }}전</ParaText>
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
        .then(loadHistory);
    };

    const getChapterText = (section) => {
      const { origin } = section;
      if (origin === "L") {
        if (section.level < 0) {
          return "도전";
        } else {
          return util.chapter.rangeText(section.chapter, " 단계");
        }
      } else {
        /**
         * 교과서의 section은 "1학년 1학기"와 같이 출력해달라고 함.
         * 이 정보는 chapter에 있는데 "국어 1학년 1학기"와 같은 값을 이용해야함
         */
        const { desc } = section.chapter;
        const p = desc.indexOf(" ");
        return p > 0 ? desc.substring(p + 1) : desc;
      }
    };
    const loadHistory = () => {
      quizHistory
        .createHistories(props.origin, license.value.uuid, sections)
        .then((res) => {
          /**
           * lastAccessTime 의 내램차순으로 정렬 후 4개만 걸러냄
           */
          res.histories.sort(
            (h0, h1) => -1 * (h0.lastAccessTime - h1.lastAccessTime)
          );
          histories.value = [...res.histories.slice(0, 4)];
        });
    };
    loadHistory();
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
    column-gap: 8px;
    padding: 5px 10px 5px 24px;
    margin-bottom: 12px;
    border-radius: 40px;
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
    &.brown {
      color: #865900;
      background-color: #ffd700;
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
      font-weight: 500;
      white-space: nowrap;
      text-overflow: ellipsis;
      flex: 1 1 auto;
      span + span {
        margin-left: 8px;
      }
    }
    .lat {
      text-align: right;
      font-family: "Noto Sans KR", Avenir, Helvetica, Arial, sans-serif;
      font-size: 12px;
      white-space: nowrap;
      font-weight: 500;
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
