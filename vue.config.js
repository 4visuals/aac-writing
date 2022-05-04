let path = require("path");

module.exports = {
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === "development") {
      /*
       * .vue?[hash] 와 같이 하나의 소스파일에 대해 수많은 버전이 devtool에 등장해서 디버깅을 어렵게 함
       *
       * https://github.com/vuejs/vue-cli/issues/2978#issuecomment-1061816803
       * 위 링크를 참고해서 vue 파일 생성 구조를 변경함
       *
       * devtool > source탭 > Page탭에서 [vue-source://] 아래에 원본 소스 파일들이 모여있음.
       * 파일을 검색할때 "Ctrl+P"를 입력 후 vue-source://App.vue 와 같이 바로 접근할 수 있다.
       *
       */
      // See available sourcemaps:
      // https://webpack.js.org/configuration/devtool/#devtool
      config.devtool = "eval-source-map";
      // console.log(`NOTICE: vue.config.js directive: ${config.devtool}`)

      config.output.devtoolModuleFilenameTemplate = (info) => {
        let resPath = path.normalize(info.resourcePath);
        let isVue = resPath.match(/\.vue$/);
        let isGenerated = info.allLoaders;

        let generated = `webpack-generated:///${resPath}?${info.hash}`;
        let vuesource = `vue-source:///${resPath}`;

        return isVue && isGenerated ? generated : vuesource;
      };

      config.output.devtoolFallbackModuleFilenameTemplate =
        "webpack:///[resource-path]?[hash]";
    }
  },
  devServer: {
    port: 5000,
  },
  pwa: {
    name: "그림한글 받아쓰기",
    themeColor: "#4DBA87",
    msTileColor: "#000000",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",
    manifestOptions: {
      background_color: "#ffffff",
      lang: "ko-KR",
      categories: ["education", "kids"],
    },
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "src/service-worker.js",
      excludeChunks: ["admin-module"],
    },
  },
};
