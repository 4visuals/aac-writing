<template>
  <div class="badge" @click="$emit('click')">
    <span class="icon" :style="`background-image: url('${icon}')`"></span>
    <span class="text">{{ text }}</span>
  </div>
</template>

<script>
export default {
  props: ["icon", "text"],
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.badge {
  display: flex;
  align-items: center;
  font-size: 12px;
  column-gap: 4px;
  border-radius: 24px;
  background-color: white;
  padding: 0px 8px 0px 0px;
  border: 2px solid transparent;
  cursor: pointer;
  color: inherit;
  box-shadow: 0px 0px 4px #0000004d;
  .icon {
    width: 20px;
    height: 20px;
    background-size: 120%;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 10px;
  }
  .text {
    font-size: 0.9em;
  }
}
</style>
