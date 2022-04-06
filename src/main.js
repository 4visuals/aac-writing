import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import "./assets/global.scss";
import GooglgAuth from "vue3-google-oauth2";
import env from "@/service/env";

const app = createApp(App);
app.use(store).use(router).use(GooglgAuth, {
  clientId: env.GOOGLE_CLIENT_ID,
  scope: "profile email",
  prompt: "consent",
});
app.provide("$gAuth", app.config.globalProperties.$gAuth);
app.mount("#app");
app.config.errorHandler = (err, instance) => {
  console.error(err);
  console.error(instance);
};
store.dispatch("course/loadChapter", { origin: "L" });
store.dispatch("user/autoLogin");
