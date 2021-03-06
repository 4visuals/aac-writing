/* eslint-disable no-undef */

// importScripts(
//   "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js"
// );

workbox.precaching.cleanupOutdatedCaches();

console.log("[WORKBOX]", workbox.routing);
workbox.core.setCacheNameDetails({ prefix: "aac-write-test" });

console.log("[SW] ready");
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {
  directoryIndex: null,
});

// workbox.routing.registerNavigationRoute("/index.html");
workbox.routing.registerNavigationRoute(
  workbox.precaching.getCacheKeyForURL("index.html")
);

// const matched = (conf) => {
//   console.log("[MATCHED]", conf);
//   return conf.url.pathname.startsWith("/chapters");
// };
// ref: https://gaute.app/dev-blog/workbox-in-vue
console.log("registering route");
workbox.routing.registerRoute(
  /\/api\/chapters\/origin\/L/,
  new workbox.strategies.StaleWhileRevalidate({
    cachName: "aac-write-test",
  })
);
workbox.routing.registerRoute(
  /\/api\/user\/membership/,
  new workbox.strategies.StaleWhileRevalidate({
    cachName: "aac-write-test",
  })
);
// workbox.routing.registerRoute(
//   /\/api\/user\/login/,
//   new workbox.strategies.StaleWhileRevalidate({
//     cachName: "aac-write-test",
//   }),
//   "POST"
// );

workbox.routing.registerRoute(
  (v) => {
    // console.log("[v]", v);
    return (
      v.url.origin === "https://fonts.googleapis.com" ||
      v.url.origin === "https://fonts.gstatic.com"
    );
  },
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "google-fonts",
  })
);
