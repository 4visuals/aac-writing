<template>
  <div class="nav-bar">
    <ActionIcon icon="arrow_circle_left" />
    <h3>단계별 받아쓰기</h3>
    <div class="user">김똘똘</div>
  </div>
</template>

<script>
import { ActionIcon } from "@/components/form";

export default {
  components: {
    ActionIcon,
  },
};
</script>

<style lang="scss" scoped>
.nav-bar {
  font-size: 4rem;
  display: flex;
  align-items: center;
  h3 {
    font-size: inherit;
    flex: 1 1 auto;
  }
  .user {
    font-size: 2rem;
  }
}
</style>
