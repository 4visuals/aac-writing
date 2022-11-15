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
      <p>{{ error.message }}</p>
    </div>
  </div>
</template>

<script>
import { TextField } from "@/components/form";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import message from "../service/message";
import toast from "../components/toast";

export default {
  components: {
    TextField,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const form = ref({ id: "", password: "" });
    const error = ref(null);
    const clearLoginUser = () => {
      store.commit("user/clearMembership");
      store.commit("exam/clear");
    };
    const tryLogin = () => {
      clearLoginUser();
      store
        .dispatch("user/loginManual", { ...form.value })
        .then((membership) => {
          const { name } = membership.user;
          toast.info(`안녕하세요! ${name}님!`, "WELCOME", 10);
          router.push("/support");
        })
        .catch((err) => {
          error.value = { e: err, message: message.parse(err.cause) };
        });
    };
    return { form, error, tryLogin };
  },
};
</script>

<style lang="scss" scoped>
.login-form {
  width: 100%;
  // max-width: 360px;
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
