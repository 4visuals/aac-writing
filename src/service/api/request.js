import axios from "axios";
import env from "@/service/env";

const host = env.BACKEND_HOST;
axios.defaults.baseURL = `${host}/api`;
// axios.interceptors.request.use(jwtInjector);

axios.interceptors.response.use(
  (res) => res,
  (e) => {
    // console.log(e)
    // const res = e.response.data
    // const handler = errorHandlers(res.cause)
    return Promise.reject(e);
  }
);

function onError(e) {
  let res;
  if (e.response) {
    res = e.response && e.response.data;
    res = res || { cause: "" };
    res.success = false;
    res.status = e.response.status;
    res._error = e;
  } else {
    res = {
      success: false,
      cause: e.message,
      status: 599,
    };
  }
  throw res;
}

function onSuccess(res) {
  res.data.status = res.status;
  return res.data;
}
function parseArgs() {
  if (arguments.length < 1) {
    throw new Error("...(url, [args]) required");
  }

  const args = [];
  for (let i = 0; i < arguments.length; i++) {
    args[i] = arguments[i];
  }
  return {
    args,
  };
}

function GET() {
  let param = parseArgs(...arguments);
  if (param.args.length === 2) {
    param.args[1] = { params: param.args[1] };
  }
  return axios
    .get(...param.args)
    .then((res) => onSuccess(res))
    .catch((err) => onError(err));
}
function POST() {
  const param = parseArgs(...arguments);
  return axios
    .post(...param.args)
    .then((res) => onSuccess(res))
    .catch((err) => onError(err));
}
function UPLOAD(url, formData) {
  return axios
    .post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => onSuccess(res))
    .catch((err) => onError(err));
}
function PUT() {
  const param = parseArgs(...arguments);
  return axios
    .put(...param.args)
    .then((res) => onSuccess(res))
    .catch((err) => onError(err));
}
function DELETE() {
  const param = parseArgs(...arguments);
  if (param.args.length === 2) {
    param.args[1] = { data: param.args[1] };
  }
  return axios
    .delete(...param.args)
    .then((res) => onSuccess(res))
    .catch((err) => onError(err));
}

export { GET, PUT, POST, DELETE, UPLOAD, onError, onSuccess };
