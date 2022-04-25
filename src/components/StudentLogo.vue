<template>
  <div class="stud-logo-wrapper">
    <div class="chr logo">{{ char() }}</div>
  </div>
</template>

<script>
export default {
  props: ["student"],
  setup(props) {
    const char = () => {
      return props.student.name
        .split("")
        .reverse()
        .slice(0, 2)
        .reverse()
        .join("");
    };
    return { char };
  },
};
</script>

<style lang="scss" scoped>
.stud-logo-wrapper {
  display: flex;
  .logo {
    width: 32px;
    height: 32px;
    line-height: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: brown;
    color: white;
    border-radius: 28px;
    padding: 6px;
    font-size: 12px;
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
  }
}
</style>
