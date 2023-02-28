<template>
  <div class="layout-h"><slot /></div>
</template>

<script>
export default {
  setup() {
    return {};
  },
};
</script>

<style lang="scss">
.layout-h {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  & > .layout-h-child {
    flex: 1 1 auto;
  }
  & > .w-1190px {
    max-width: 1190px;
    padding: 20px;
    padding-top: 0px;
  }
}
</style>
