import env from "@/service/env";

const google = {
  authUrl: "https://accounts.google.com/o/oauth2/auth",
};

const resolveUrl = (option) => {
  const qs = Object.assign({}, option);
  qs.response_type = qs.response_type || "token";
  qs.scope = qs.scope || "https://www.googleapis.com/auth/userinfo.email";
  const queryString = Object.keys(qs)
    .map((key) => `${key}=${qs[key]}`)
    .join("&");
  return google.authUrl + "?" + queryString;
};

const initGoogleSignIn = (callback, failedCallback, showPrompt = false) => {
  window.google.accounts.id.initialize({
    client_id: env.GOOGLE_CLIENT_ID,
    context: "signin",
    callback,
    cancel_on_tap_outside: false,
    scope:
      "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid",
    ux_mode: "popup",
  });
  if (showPrompt) {
    setTimeout(() => {
      window.google.accounts.id.prompt();
    });
  }
  // return Promise.resolve(true);
};
const showOneTab = () => {
  window.google.accounts.id.prompt();
};
export default {
  resolveUrl,
  initGoogleSignIn,
  showOneTab,
};
