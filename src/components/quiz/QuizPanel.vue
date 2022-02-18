<template>
  <h3>Quiz</h3>
</template>

<script>
import { useRoute } from "vue-router";

export default {
  setup() {
    const route = useRoute();
    console.log("[QUIZ]", route.params.seq);
  },
};
</script>

<style></style>
