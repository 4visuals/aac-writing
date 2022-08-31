<template>
  <div class="sheet" :style="`--sheet-col-width: ${colsize}`">
    <div class="fixed-column"><slot name="fcol" /></div>
    <div
      class="scrollable"
      :ref="bindScrollable"
      @wheel.prevent.stop="pageScroll"
    >
      <div class="dataview" :class="{ 'column-based': columnBased }">
        <slot name="data" />
      </div>
    </div>
  </div>
</template>
<script setup>
const pageScroll = (e) => {
  const { deltaY } = e;
  const el = e.currentTarget;
  const { scrollLeft, offsetWidth, scrollWidth } = el;
  if (offsetWidth >= scrollWidth) {
    return;
  }
  if (deltaY > 0 && scrollLeft + offsetWidth === scrollWidth) {
    return;
  }
  if (deltaY < 0 && scrollLeft === 0) {
    return;
  }
  el.scrollBy({ top: 0, left: deltaY / 2 });
};

const bindScrollable = (el) => {};
</script>
<script>
export default {
  props: ["colsize", "columnBased"],
};
</script>

<style lang="scss" scoped>
.sheet {
  position: relative;
  display: flex;
  flex-direction: column;
  .fixed-column {
    position: relative;
    z-index: 2;
    // overflow: hidden;
    display: block;
    width: var(--sheet-col-width);
    background-color: white;
    border-right: 1px solid #6666664d;
    margin-bottom: 2px;
  }
  .scrollable {
    position: absolute;
    right: 0;
    left: 0;
    z-index: 1;
    overflow-x: auto;
    display: flex;
    &::-webkit-scrollbar {
      width: 2px;
      height: 2px;
      position: absolute;
      left: 0;
    }
    .dataview {
      position: relative;
      margin-left: calc(0px + var(--sheet-col-width));
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      &.column-based {
        flex-direction: row;
      }
    }
  }
  .dimmer {
    position: absolute;
    width: 60px;
    top: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    background: linear-gradient(90deg, transparent, white);
    pointer-events: none;
  }
}
</style>
