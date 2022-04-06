<template>
  <div class="wrapper" v-if="ready">
    <!-- <button @click="login2">LOGIN</button> -->
    <div
      id="g_id_onload"
      data-client_id="482880627778-rt7oi0of0fppg08opa0ob8fgqiuepain.apps.googleusercontent.com"
      data-context="signin"
      data-ux_mode="popup"
      data-callback="onCallback"
      data-auto_select="true"
    ></div>
    <div
      class="g_id_signin"
      data-type="standard"
      data-shape="rectangular"
      data-theme="outline"
      data-text="signin_with"
      data-size="large"
      data-logo_alignment="left"
    ></div>
  </div>
</template>

<script>
import env from "@/service/env";
import google from "./google";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
export default {
  setup(props) {
    const ready = ref(false);
    const store = useStore();
    // const Vue3GoogleOauth = inject("Vue3GoogleOauth");
    // const $gAuth = inject("$gAuth");
    console.log(props);
    onMounted(() => {
      window.onCallback = (a, b, c) => {
        console.log(a);
        console.log(b);
        console.log(c);
        store
          .dispatch("user/checkMembership", {
            vendor: "google",
            credential: a.credential,
          })
          .then((res) => {
            console.log(res);
          });
      };
      ready.value = true;
    });
    const login = () => {
      const url = google.resolveUrl({
        client_id: env.GOOGLE_CLIENT_ID,
        redirect_uri: env.OAUTH_REDIRECT_URL,
        response_type: "code",
      });
      console.log(url);
      window.location.href = url;
    };
    // function login2() {
    //   $gAuth.signIn().then((user, b) => {
    //     console.log(user, b);
    //   });
    // }
    return {
      login,
      // login2,
      ready,
      // Vue3GoogleOauth,
    };
  },
};
</script>

<style></style>
