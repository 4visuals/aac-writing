<template>
  <div class="welcome">
    <Logo :imagePath="membership.image" size="md" />
    <h3>환영합니다.</h3>
    <ParaText
      >로그인 후 이용할 수 있으며 7일간의 무료체험이 제공됩니다.</ParaText
    >
    <router-link to="/">로그인 페이지로 이동</router-link>
  </div>
</template>

<script>
import Logo from "@/components/oauth/Logo.vue";
import { useStore } from "vuex";
import { ParaText } from "../../components/text";
export default {
  components: {
    Logo,
    ParaText,
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
