<template>
  <div>
    <div class="section-list">
      <div class="type"><ParaText>보고 쓰기</ParaText></div>
      <div class="elems">
        <QuestionList :histories="histories" :sentences="sentences" />
      </div>
    </div>
  </div>
</template>

<script>
import { ParaText } from "../../components/text";
import QuestionList from "@/components/QuestionList.vue";

export default {
  props: ["histories", "sentences"],
  components: { ParaText, QuestionList },
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped></style>
