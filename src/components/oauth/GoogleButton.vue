<template>
  <div ref="btnRef"></div>
</template>

<script>
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import env from "@/service/env";

export default {
  props: {
    shape: { type: String, default: "pill" },
    size: { type: String, default: "large" },
    theme: { type: String, default: "filled_blue" },
    text: { type: String, default: "signin_with" },
    type: { type: String, default: "standard" },
  },
  setup(props, { emit }) {
    const btnRef = ref(null);
    const store = useStore();
    const handleResponse = (res) => {
      store
        .dispatch("user/checkMembership", {
          vendor: "google",
          token: res.credential,
          type: "id_token",
        })
        .then((membership) => {
          if (!membership.user) {
            emit("join");
          }
        });
    };

    const initButton = () => {
      window.google.accounts.id.initialize({
        client_id: env.GOOGLE_CLIENT_ID,
        callback: handleResponse,
        state_cookie_domain: env.HOST,
        scope:
          "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid",
        ux_mode: "popup",
      });
      const { theme, size, shape, text } = props;
      window.google.accounts.id.renderButton(
        btnRef.value,
        {
          theme,
          size,
          text,
          shape,
        } // customization attributes
      );
    };

    const awaitScriptLoading = () => {
      if (window?.google?.accounts) {
        initButton();
      } else {
        setTimeout(awaitScriptLoading, 100);
      }
    };
    onMounted(() => {
      awaitScriptLoading();
    });
    return { btnRef };
  },
};
</script>

<style lang="scss" scoped></style>
