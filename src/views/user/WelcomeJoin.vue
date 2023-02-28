<template>
  <div class="welcome">
    <Logo :imagePath="membership.image" size="md" />
    <h3>계정을 생성했습니다.</h3>
    <router-link to="/">로그인 페이지로 이동</router-link>
  </div>
</template>

<script>
import Logo from "@/components/oauth/Logo.vue";
import { useStore } from "vuex";
export default {
  components: {
    Logo,
  },
  setup() {
    const store = useStore();
    return {
      membership: store.state.user.membership,
    };
  },
};
</script>

<style lang="scss" scoped>
.welcome {
  padding: 16px;
  display: flex;
  flex-direction: column;
  row-gap: 1.2rem;
  align-items: center;
}
</style>
