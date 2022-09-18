import { createApp } from "vue";
import App from "./App.vue";
import { Modal, ModalHeader } from "./components";
import AacButton from "./components/form/AacButton.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import "./assets/global.scss";
import GooglgAuth from "vue3-google-oauth2";
import env from "@/service/env";
import quizHistoryStore from "./dao/quiz-history-store";
import request from "./service/api/request";

const app = createApp(App);
app.use(store).use(router).use(GooglgAuth, {
  clientId: env.GOOGLE_CLIENT_ID,
  scope: "profile email",
  prompt: "consent",
});
/**
 * installing global components
 */
app
  .component("AacButton", AacButton)
  .component("Modal", Modal)
  .component("ModalHeader", ModalHeader);
/**
 * inject google oauth helper
 */
app.provide("$gAuth", app.config.globalProperties.$gAuth);
/**
 * inject dynamic store
 */
quizHistoryStore.register(store);

app.mount("#app");

const errorHandler = (err) => {
  console.error(err);
  if (err.cause == "TOKEN_EXPIRED") {
    location.href = "/";
  }
};
app.config.errorHandler = errorHandler;
request.setErrorCallback(errorHandler);
