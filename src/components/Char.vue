<template>
  <div
    class="char"
    :class="{
      dummy: ch === ' ',
      active,
      chosung: type === 'chosung',
      jungsung: type === 'jungsung',
      jongsung: type === 'jongsung',
    }"
  >
    <span>{{ ch }}</span>
  </div>
</template>

<script>
export default {
  props: ["ch", "type", "active"],
  setup() {},
};
</script>

<style lang="scss" scoped>
$size: 36px;
$padding: 6px;
.char {
  display: flex;
  width: $size + $padding;
  height: $size + $padding;
  flex: 0 0 ($size + $padding);
  align-items: center;
  justify-content: center;
  padding: $padding;
  // border: 1px solid #ccc;
  margin: 4px;
  position: relative;
  font-size: $size;
  background-color: #e8e8e8d1;
  color: #c8c8c8;
  font-weight: 400;
  &.active {
    font-weight: 600;
    &.chosung {
      background-color: #d8f1ff;
      color: #45afec;
    }
    &.jungsung {
      background-color: #f6ff9b;
      color: #7c8618;
    }
    &.jongsung {
      background-color: #fcd6ff;
      color: #dd60e6;
    }
    > span {
      animation: blink 1s ease-in-out 0s infinite;
    }
  }
  span {
    line-height: 1;
    display: block;
    position: absolute;
  }
}
@keyframes blink {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
