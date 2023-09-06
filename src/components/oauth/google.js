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
    callback,
    state_cookie_domain: env.HOST,
    scope:
      "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid",
    ux_mode: "popup",
  });
  if (showPrompt) {
    window.google.accounts.id.prompt((notification) => {
      if (
        notification.isNotDisplayed() &&
        notification.getNotDisplayedReason() === "opt_out_or_no_session"
      ) {
        failedCallback(notification.getNotDisplayedReason());
      }
    });
  }
  return Promise.resolve(true);
};
export default {
  resolveUrl,
  initGoogleSignIn,
};
