<template>
  <div class="cols"><slot /></div>
</template>

<style lang="scss" scoped>
.cols {
  display: flex;
  flex-direction: column;
  &.even {
    background-color: #f8f8f9;
  }
  &.odd {
    background-color: #f2f2f4;
  }
}
</style>
