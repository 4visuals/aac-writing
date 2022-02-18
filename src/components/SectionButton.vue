<template>
  <div class="section" @click="$emit('itemClicked', item)">
    <h4>{{ item.title }}</h4>
    <p>{{ item.subTitle }}</p>
  </div>
</template>

<script>
export default {
  props: ["item"],
  setup() {
    const emit = () => {};
    return { emit };
  },
};
</script>

<style lang="scss" scoped>
.section {
  user-select: none;
  font-size: 4rem;
  p {
    font-size: 2rem;
  }
}
</style>
