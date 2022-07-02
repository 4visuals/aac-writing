/**
 * 환경 변수 모음
 * .env.[mode]에 정의된 변수를 쉽게 접근하기 위한 wrapper
 *
 */
const envs = {};
const PREFIX = "VUE_APP_";
Object.keys(process.env).forEach((key) => {
  if (key.startsWith(PREFIX)) {
    const k = key.substring(PREFIX.length);
    envs[k] = process.env[key];
  }
});
envs.devMode = envs.MODE === "DEVLELOPMENT";
envs.prodMode = envs.MODE === "PRODUCTION";
export default envs;
