<template>
  <div class="menu-section">
    <h3>{{ title }}</h3>
    <slot />
  </div>
</template>

<script>
export default {
  props: ["title"],
};
</script>

<style lang="scss" scoped>
.menu-section {
  padding: 8px 16px;
  > h3 {
    font-size: 1.2rem;
    user-select: none;
  }
}
</style>
