/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

import { register } from "register-service-worker";
import store from "./store";

// import { registerRoute } from "workbox-routing";
// import { StaleWhileRevalidate } from "workbox-strategies";
console.log(
  "[SW] regsiter: ",
  process.env.NODE_ENV,
  `${process.env.BASE_URL}service-worker.js`
);
if (process.env.NODE_ENV !== "development") {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        "[SW:ready] App is being served from cache by a service worker.\n" +
          "For more details, visit https://goo.gl/AFskqB"
      );
      // load data here
      store.dispatch("course/loadChapter", { origin: "L" });
      store.dispatch("user/autoLogin");
    },
    registered() {
      console.log("[SW:registered] Service worker has been registered.");
    },
    cached() {
      console.log("Content has been cached for offline use.");
    },
    updatefound() {
      console.log("New content is downloading.");
    },
    updated(registration) {
      console.log("New content is available; please refresh.");
      console.log(registration);
      // https://stackoverflow.com/questions/63410864/how-to-skip-waiting-service-worker-in-vue-pwa
      // registration.waiting.postMessage({ type: "SKIP_WAITING" });
    },
    offline() {
      console.log(
        "[SW:offline] No internet connection found. App is running in offline mode."
      );
    },
    error(error) {
      console.error(
        "[SW:error] Error during service worker registration:",
        error
      );
    },
  });

  const aacDictRequest = ({ req, event }) => {
    console.log(req.url);
    console.log(event);
    return true;
  };
  // registerRoute(aacDictRequest, new StaleWhileRevalidate());
} else {
  store.dispatch("course/loadChapter", { origin: "L" });
  store.dispatch("user/autoLogin");
}
