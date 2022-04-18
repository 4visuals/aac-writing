<template>
  <div class="rows"><slot /></div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.rows {
  display: flex;
  flex: 1 1 auto;
  &.even {
    background-color: #f8f8f9;
  }
  &.odd {
    background-color: #f2f2f4;
  }
}
</style>
