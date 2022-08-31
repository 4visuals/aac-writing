<template>
  <div class="menu-section">
    <h3>{{ title }}</h3>
    <div class="menu-item">
      <slot />
    </div>
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
    font-size: 1.25rem;
    user-select: none;
  }
  > .menu-item {
    display: flex;
    align-items: center;
    dl,
    dd {
      margin: 0;
    }
  }
}
</style>
