<template>
  <div class="q-list">
    <div class="label" :class="theme">
      <SpanText>{{ examDesc }}</SpanText>
    </div>
    <div class="part">
      <div class="container-fluid">
        <div class="sentence-list row">
          <div
            class="cell col-6 col-sm-6 col-md-4 col-lg-3"
            v-for="group in groups"
            :key="group.key"
          >
            <AppButton
              size="chapter"
              :theme="theme"
              :backgroundColor="getHistoryBg(group)"
              :text="resolveGroupText(group)"
              @click="$emit('choosen', { group, quizMode, answerType })"
            ></AppButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "@vue/reactivity";
import { SpanText } from "@/components/text";
import { watch } from "@vue/runtime-core";
import { useStore } from "vuex";
import { quizDao } from "@/dao";
import { AppButton } from "./form";
import util from "@/service/util";

export default {
  props: ["theme", "section", "desc", "quizMode", "answerType", "wordMode"],
  components: {
    SpanText,
    AppButton,
  },
  setup(props) {
    const store = useStore();
    const descritions = {
      READING: "보고 쓰기",
      LEARNING: "연습하기",
      QUIZ: "받아쓰기",
    };
    const bgMap = {
      blue: "#D2ECFD",
      brown: "#F1EBDB",
    };
    const activeLicense = computed(() => store.getters["exam/activeLicense"]);
    const sentencesRef = ref([]);
    const examDesc = ref(null);
    const sectionHistories = ref([]);

    const groups = ref([]);
    const size = 10;
    const updateGroups = () => {
      const sentences = sentencesRef.value;
      groups.value = [];
      const groupSize =
        sentences.length / size + (sentences.length % size > 0 ? 1 : 0);
      for (let k = 0; k < groupSize; k++) {
        const s = size * k;
        const e = Math.min(sentences.length, s + size);
        groups.value.push({
          key: k,
          start: s,
          end: e,
          rand: false,
          sentences: sentences.slice(s, e),
        });
      }
      if (props.section.origin === "B") {
        // [종합] 버튼 추가
        groups.value.push({
          key: groupSize,
          start: 0,
          end: 0,
          rand: true,
          sentences: util.pick(sentences, 10),
        });
      }
    };
    const hasHistory = (group) => {
      const { start, end } = group;
      return sectionHistories.value.find(
        (h) => h.ranges[0] === start && h.ranges[1] === end
      );
    };

    const replace = (arrayRef, elems) => {
      arrayRef.value.splice(0, arrayRef.value.length);
      arrayRef.value.push(...elems);
    };
    const findQuizHistories = () => {
      const { section, wordMode, quizMode } = props;
      const quizResource = wordMode ? "W" : "S";
      const mode = quizMode;
      return quizDao.findByQuiz(
        activeLicense.value.uuid,
        section.seq,
        quizResource,
        mode
      );
      // .then((res) => {
      //   quizHistories.value.push(...res);
      // });
    };

    const getHistoryBg = (group) => {
      if (hasHistory(group)) {
        return bgMap[props.theme];
      } else {
        return "";
      }
    };
    const listQuestions = () => {
      const { section, quizMode, wordMode } = props;
      const quizResource = wordMode ? "W" : "S";
      const sentences = section.sentences.filter(
        (sen) => sen.type === quizResource
      );
      examDesc.value = descritions[quizMode];
      findQuizHistories().then((histories) => {
        replace(sectionHistories, histories);
        replace(sentencesRef, sentences);
        updateGroups();
      });
    };

    const resolveGroupText = (group) => {
      const { rand, start, end } = group;
      return rand ? "종합" : `${start + 1} ~ ${end}`;
    };
    listQuestions();

    watch(() => props.wordMode, listQuestions);
    return {
      examDesc,
      groups,
      hasHistory,
      getHistoryBg,
      resolveGroupText,
    };
  },
};
</script>

<style lang="scss" scoped>
.q-list {
  display: flex;
  padding: 16px;
  flex: 1 1 auto;
  width: 80%;
  margin: 0 auto;
  .label {
    flex: 0 0 25%;
    color: inherit;
    font-weight: 600;
    &.blue {
      color: #4b7bec;
    }
    &.brown {
      color: #865900;
    }
  }
  .part {
    flex: 1 1 auto;
    .sentence-list {
      .cell {
        display: flex;
        margin-bottom: 16px;
        .item {
          flex: 1 1 auto;
          display: inline-flex;
          justify-content: center;
          border-radius: 8px;
          padding: 8px 16px;
          background-color: #ffeb3b;
          color: #865900;
          user-select: none;
          cursor: pointer;
          &.visited {
            background-color: #feb62c;
            color: #251900;
          }
        }
      }
    }
  }
}
</style>
