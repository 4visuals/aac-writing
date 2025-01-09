<template>
  <div class="qna">
    <div class="question" :class="{ 'active-level': activeLevel }">
      <span
        class="char"
        v-for="char in chars"
        :key="char.idx"
        :class="{ matched: char.matched }"
        >{{ char.ch }}</span
      >
    </div>
    <div class="ans">
      <span
        class="char"
        v-for="char in answers"
        :key="char.idx"
        :class="{ matched: false }"
        >{{ char.ch }}</span
      >
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, watch } from "vue";
const props = defineProps(["question", "activeLevel"]);

const chars = ref([]);
const answers = ref([]);

const levelToText = (lvl) => {
  const level = `0${lvl || 0}`;
  return `L${level.slice(-2)}`;
};
const matched = (levels, index) => {
  if (!levels) {
    return false;
  }
  const endIdx = index + 3;
  const found = levels.filter(
    (range) =>
      (index <= range[0] && range[0] < endIdx) ||
      (index < range[1] && range[1] <= endIdx) ||
      (range[0] < index && index < range[1])
  );
  return found.length > 0;
};
const splitToChar = () => {
  const { question, answer, analysis } = props.question;
  const Lnn = levelToText(props.activeLevel);
  const levels = analysis[Lnn]; // {L01: [[start, end], [start, end]]}
  console.log(levels);

  const arr = question.split("").map((ch, idx) => ({
    idx: idx * 3,
    ch,
    matched: matched(levels, idx * 3),
  }));
  chars.value = arr;
  if (answer) {
    answers.value = answer.answer.split("").map((ch, idx) => ({
      idx: idx * 3,
      ch,
    }));
  }
};

const highlightLevel = () => {
  console.log("[lvl]", props.activeLevel);
  splitToChar();
};
watch(() => props.question, splitToChar, { immediate: true });
watch(() => props.activeLevel, highlightLevel);
</script>

<style lang="scss" scoped>
.qna {
  width: 100%;
  font-size: 1.2rem;
  border: 1px solid #ababab;
  border-radius: 4px;
  padding: 4px;
  .question {
    &.active-level {
      color: #aaa;
    }
    .char {
      &.matched {
        color: red;
        background-color: #ffedc3;
        border-radius: 4px;
      }
    }
  }
  .char {
    display: inline-flex;
    padding: 0 1px;
  }
}
</style>
