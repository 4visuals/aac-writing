<template>
  <div class="welcome">
    <Logo :imagePath="membership.image" size="md" />
    <h3>가입완료</h3>
    <ParaText>{{ membership.profile.email }}님의 가입을 환영합니다.</ParaText>
    <ParaText
      >로그인 후 이용할 수 있으며 7일간의 무료체험이 제공됩니다.</ParaText
    >
    <AppButton text="닫기" @click="$emit('close')" />
  </div>
</template>

<script>
import Logo from "@/components/oauth/Logo.vue";
import { useStore } from "vuex";
import { ParaText } from "../../components/text";
import { AppButton } from "../../components/form";
export default {
  components: {
    Logo,
    ParaText,
    AppButton,
  },
  props: ["user"],
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
