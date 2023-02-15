<template>
  <div class="score abs-center">
    <h3>{{ score }}점!!</h3>
    <div class="ctrl">
      <AppButton
        text="오답확인"
        theme="red"
        size="nav"
        :invert="true"
        :fill="true"
        @click="$emit('view-answer')"
        borderColor="#d03c19"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    score: {
      type: Number,
    },
  },
  emits: ["view-answer"],
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.score {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  row-gap: 24px;
  h3 {
    font-family: "NanumSquareRound";
    font-size: 10vmin;
    font-weight: 900;
    white-space: nowrap;
    color: #4d4d4d;
  }
}
</style>
