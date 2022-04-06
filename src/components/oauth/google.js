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
export default {
  resolveUrl,
};
