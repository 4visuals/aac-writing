<template>
  <div class="chart-cell" :class="{ empty: !stat }">
    <template v-if="stat">
      <div class="correct bar" :style="{ width: widthOf('correct') }"></div>
      <div class="failed bar" :style="{ width: widthOf('failed') }"></div>
      <span class="score">{{ score() }}</span>
    </template>
    <div v-else class="empty bar"></div>
  </div>
</template>

<script>
export default {
  props: ["stat"],
  setup(props) {
    const widthOf = (prop) => {
      const ratio = 100 * (props.stat[prop] / props.stat.total);
      return `${ratio}%`;
    };
    const score = () => {
      return `${props.stat.correct}/${props.stat.total}`;
    };
    return {
      widthOf,
      score,
    };
  },
};
</script>

<style lang="scss" scoped>
.chart-cell {
  display: flex;
  position: absolute;
  top: 1px;
  left: 1px;
  right: 1px;
  bottom: 1px;
  background-color: #eee;
  user-select: none;
  &.empty {
    background-color: inherit;
  }
  .bar {
    &.correct {
      background-color: greenyellow;
    }
    &.failed {
      background-color: orange;
    }
  }
  .score {
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    justify-content: flex-start;
    align-items: center;
    padding: 0 4px;
  }
}
</style>
