<template>
  <div class="q-list" :class="quizMode">
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
              :fluid="true"
              size="sm"
              :theme="theme"
              :backgroundColor="getHistoryBg(group)"
              :text="resolveGroupText(group)"
              @click="$emit('choosen', { group, quizMode, answerType })"
            ></AppButton>
          </div>
          <div
            v-if="recordVisible && hasWrongAnswer"
            class="cell col-6 col-sm-6 col-md-4 col-lg-3"
          >
            <AppButton
              :fluid="true"
              size="sm"
              :backgroundColor="section.origin === 'L' ? '#ffd700' : '#DAFDFF'"
              :theme="section.origin === 'L' ? 'brown' : 'sentence'"
              text="오답연습"
              @click="tryFailedQuestion"
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
import { QuizModeText } from "./quiz/text-map";

export default {
  props: [
    "theme",
    "section",
    "desc",
    "quizMode",
    "answerType",
    "wordMode",
    "recordVisible",
  ],
  components: {
    SpanText,
    AppButton,
  },
  setup(props, { emit }) {
    const store = useStore();
    const bgMap = {
      word: "#D2ECFD",
      sentence: "#DAFDFF",
      brown: "#F1EBDB",
    };
    const activeLicense = computed(() => store.getters["exam/activeLicense"]);
    const sentencesRef = ref([]);
    const examDesc = ref(null);
    const sectionHistories = ref([]);
    const hasWrongAnswer = computed(() => {
      const answers = store.getters["record/wrongAnswers"](props.section);
      const type = props.wordMode ? "W" : "S";
      const filtered = answers.filter((record) => record.type === type);
      return filtered.length > 0;
    });

    const groups = ref([]);
    const size = 10;

    const createGroup = (key, start, end, randomQuiz, sentences) => ({
      key,
      start,
      end,
      random: randomQuiz,
      sentences,
    });
    const updateGroups = () => {
      const sentences = sentencesRef.value;
      groups.value = [];
      const groupSize =
        sentences.length / size + (sentences.length % size > 0 ? 1 : 0);
      for (let k = 0; k < groupSize; k++) {
        const s = size * k;
        const e = Math.min(sentences.length, s + size);
        groups.value.push(createGroup(k, s, e, false, sentences.slice(s, e)));
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
    const tryFailedQuestion = () => {
      const { answerType, quizMode } = props;
      emit("failed-question", { quizMode, answerType });
    };
    const findHistory = (group) => {
      const { start, end } = group;
      const history = sectionHistories.value.find(
        (h) => h.ranges[0] === start && h.ranges[1] === end
      );
      return history;
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
      const history = findHistory(group);
      if (!history) {
        return "";
      }
      /**
       * https://github.com/4visuals/aac-writing/issues/123
       */
      const { mode, ranges, questions } = history;
      const numOfQuiz = ranges[1] - ranges[0];
      if (mode === "WRITING" || numOfQuiz === questions.length) {
        /**
         * 따라쓰기(mode === 'WRITING') 는 무조건 표시함
         * https://github.com/4visuals/aac-writing/issues/167
         */
        // questions.length : 제출한 답안 갯수
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
      examDesc.value = QuizModeText[quizMode];
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
      hasWrongAnswer,
      getHistoryBg,
      resolveGroupText,
      tryFailedQuestion,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/resizer";
.q-list {
  display: flex;
  padding: 16px;
  flex: 1 1 25%;
  width: 80%;
  margin: 0 auto;

  @include mobile {
    flex-direction: column;
    width: 100%;
    margin: 0;
  }
  .label {
    flex: 0 0 25%;
    color: inherit;
    font-weight: 600;
    &.word {
      color: #4b7bec;
    }
    &.sentence {
      color: #21c2cc;
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
