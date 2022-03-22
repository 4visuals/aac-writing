import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import "./assets/global.scss";

const app = createApp(App);
app.use(store).use(router).mount("#app");
app.config.errorHandler = (err, instance) => {
  console.error(err);
  console.error(instance);
};
store.dispatch("course/loadChapter", { origin: "L" });
