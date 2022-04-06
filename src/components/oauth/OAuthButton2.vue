<template>
  <div class="wrapper">
    <!-- <button @click="login2">LOGIN</button> -->
  </div>
</template>

<script>
import env from "@/service/env";
// import UserProfile from "./UserProfile.vue";
import google from "./google";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
export default {
  components: {
    // UserProfile,
  },
  setup(props) {
    const store = useStore();
    // const Vue3GoogleOauth = inject("Vue3GoogleOauth");
    // const $gAuth = inject("$gAuth");
    const btnGoogle = ref(null);
    console.log(props);
    const handleCredentialResponse = (res) => {
      store
        .dispatch("user/checkMembership", {
          vendor: "google",
          credential: res.credential,
        })
        .then((res) => {
          console.log(res);
          renderGoogleButton();
        });
      console.log("Encoded JWT ID token: " + res.credential);
    };
    const renderGoogleButton = () => {
      const { google } = window;
      google.accounts.id.renderButton(btnGoogle.value, {
        theme: "outline",
        size: "large",
      });
    };
    const login = () => {
      const url = google.resolveUrl({
        client_id: env.GOOGLE_CLIENT_ID,
        redirect_uri: env.OAUTH_REDIRECT_URL,
        response_type: "code",
      });
      console.log(url);
      window.location.href = url;
    };
    onMounted(() => {
      const { google } = window;
      google.accounts.id.initialize({
        client_id:
          "482880627778-rt7oi0of0fppg08opa0ob8fgqiuepain.apps.googleusercontent.com",
        callback: handleCredentialResponse,
      });
      renderGoogleButton();
      google.accounts.id.prompt(); // also display the One Tap dialog
    });
    return {
      login,
      // login2,
      btnGoogle,
      // Vue3GoogleOauth,
    };
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
}
</style>
