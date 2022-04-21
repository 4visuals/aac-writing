<template>
  <div class="cell" :class="resolveClass()"><slot /></div>
</template>

<script>
export default {
  props: ["w", "nowrap"],
  setup(props) {
    const resolveClass = () => {
      const clz = [];
      clz.push(props.w || "w80");
      if (props.nowrap === "") {
        clz.push("nowrap");
      }
      return clz.join(" ");
    };
    return {
      resolveClass,
    };
  },
};
</script>

<style lang="scss" scoped>
.cell {
  padding: 0.25rem 0.6rem;
  user-select: none;
  white-space: nowrap;
  overflow: hidden;
  &.even {
    background-color: #f8f8f9;
  }
  &.odd {
    background-color: #f2f2f4;
  }
  .text {
    white-space: nowrap;
  }
  &.false {
    color: #7b7b7b;
    // background-color: #ffce6a8c;
  }
  &.true {
    color: #27600c;
    background-color: #ccff98;
  }
  &.w60 {
    width: 60px;
  }
  &.w80 {
    width: 80px;
  }
  &.w100 {
    width: 100px;
  }
  &.w120 {
    width: 120px;
  }
  &.nowrap {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
