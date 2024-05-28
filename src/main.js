import { createApp } from "vue";
import App from "./App.vue";
import { Modal, ModalHeader } from "./components";
import { AacButton, AppButton } from "./components/form";
import FormButton from "./components/form/FormButton.vue";
import AppIcon from "./components/AppIcon.vue";
import ActionIcon from "./components/form/ActionIcon.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import "./assets/global.scss";
import quizHistoryStore from "./dao/quiz-history-store";
import request from "./service/api/request";

const app = createApp(App);
app.use(store).use(router);
/**
 * installing global components
 */
app
  .component("AppIcon", AppIcon)
  .component("ActionIcon", ActionIcon)
  .component("AppButton", AppButton)
  .component("AacButton", AacButton)
  .component("FormButton", FormButton)
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
