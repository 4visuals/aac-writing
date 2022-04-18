<template>
  <div class="sheet" :style="`--sheet-col-width: ${colsize}`">
    <div class="fixed-column"><slot name="fcol" /></div>
    <div class="scrollable">
      <div class="dataview"><slot name="data" /></div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["colsize"],
};
</script>

<style lang="scss" scoped>
.sheet {
  position: relative;
  display: flex;
  flex-direction: column;
  .fixed-column {
    position: absolute;
    z-index: 2;
    overflow: hidden;
    display: block;
    width: var(--sheet-col-width);
    background-color: white;
    border-right: 1px solid #6666664d;
  }
  .scrollable {
    position: relative;
    width: 100%;
    overflow-x: auto;
    display: flex;
    .dataview {
      position: relative;
      margin-left: calc(0px + var(--sheet-col-width));
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
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
