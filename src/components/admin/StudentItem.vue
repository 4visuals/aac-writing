<template>
  <div class="student" @click="$emit('clicked', student)">
    {{ student ? student.name : "없음" }}
  </div>
</template>

<script>
export default {
  props: ["student"],
};
</script>

<style lang="scss" scoped>
@import "~@/assets/theme";
.student {
  font-size: 0.95rem;
  padding: 0.35rem 0.8rem;
  border-radius: 2rem;
  cursor: pointer;
  user-select: none;
  &:active {
    transform: translate(1px, 1px);
  }
  @include gray;
}
</style>
