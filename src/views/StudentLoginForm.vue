<template>
  <div class="login-form">
    <TextField
      icon="account_circle"
      aria-placeholder="아이디"
      placeholder="아이디"
      v-model:value="form.id"
    />
    <TextField
      icon="password"
      type="password"
      aria-placeholder="비밀번호"
      placeholder="비밀번호"
      v-model:value="form.password"
    />
    <AacButton
      theme="blue"
      fill
      borderless
      rect
      muted
      text="로그인"
      @click="tryLogin"
    />
    <div class="error" v-if="error">
      <h5>로그인 실패</h5>
      <p>아이디나 비밀번호를 확인해주세요.</p>
    </div>
  </div>
</template>

<script>
import { TextField } from "@/components/form";
import { ref } from "@vue/reactivity";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { watch } from "@vue/runtime-core";
export default {
  components: {
    TextField,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const form = ref({ id: "", password: "" });
    const error = ref(null);
    const tryLogin = () => {
      clearLoginUser();
      store
        .dispatch("user/loginStudent", { ...form.value })
        .then(() => {
          router.replace("/level");
        })
        .catch((err) => {
          console.log("[로그인 실패]", err);
          error.value = err;
        });
    };
    const clearLoginUser = () => {
      store.commit("user/clearMembership");
      store.commit("exam/clear");
    };
    watch(
      () => [form.value.id, form.value.password],
      () => {
        error.value = null;
      }
    );
    return {
      form,
      tryLogin,
      error,
    };
  },
};
</script>

<style lang="scss" scoped>
.login-form {
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  padding: 0 16px;
  .btn-login {
    padding: 15px 0;
  }
  .error {
    background-color: #fff3d3;
    color: #6c5000;
    padding: 16px 8px;
    p {
      font-size: 1.25rem;
    }
  }
}
</style>
