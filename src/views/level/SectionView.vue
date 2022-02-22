<template>
  <div class="section-detail">
    <p>{{ cate.title }}</p>
    <h3>학습/퀴즈 선택</h3>
  </div>
</template>

<script>
export default {
  props: ["cate"],
  setup(props) {
    console.log("[cate]", props.cate);
  },
};
</script>

<style></style>
