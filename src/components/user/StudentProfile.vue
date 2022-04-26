<template>
  <div class="profile">
    <ParaText>이름 : {{ student.name }}</ParaText>
    <ParaText>선생님: {{ student.teacherRef }}</ParaText>
  </div>
</template>

<script>
import { ParaText } from "@/components/text";
export default {
  props: ["student"],
  components: { ParaText },
};
</script>

<style lang="scss" scoped></style>
