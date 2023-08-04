<template>
  <Transition name="trs-scale-grow" appear>
    <div class="score">
      <video v-if="score === 100" width="100%" autoplay loop muted>
        <source :src="score100" type="video/mp4" />
      </video>
      <template v-else>
        <h3>{{ score.toFixed(0) }}점!!</h3>
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
      </template>
    </div>
  </Transition>
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
    const score100 = require("@/assets/reward/score-100.mp4");
    return { score100 };
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
  overflow: hidden;
  video {
    width: 90%;
  }
  h3 {
    font-family: "NanumSquareRound";
    font-size: 10vmin;
    font-weight: 900;
    white-space: nowrap;
    color: #4d4d4d;
  }
}
</style>
