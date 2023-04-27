<template>
  <section :style="`padding: ${padding}`"><slot /></section>
</template>

<script>
// import WidthLayout from "@/components/layout/WidthLayout.vue";
export default {
  props: {
    padding: {
      type: String,
      default: "16px",
    },
  },
  components: {
    // WidthLayout,
  },
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
section {
  box-shadow: 0px 0px 4px #0000001d, 0 0 2px #0000002d;
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
  font-size: 1.15rem;
  transition: box-shadow 0.2s linear, transform 0.2s linear;
  cursor: pointer;
  background-color: white;
  &:hover {
    box-shadow: 0px 0px 8px #2f8ed87a, 0 0 2px #2f8ed8c7;
    transform: scale(1.01);
  }
  h4 {
    margin-bottom: 8px;
  }
  .box {
    display: flex;
    flex-direction: column;
    row-gap: 8px;
  }
}
</style>
