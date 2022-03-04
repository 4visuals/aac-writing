module.exports = {
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === "development") {
      config.devtool = "eval-source-map";

      config.output.devtoolModuleFilenameTemplate = (info) =>
        info.resourcePath.match(/^\.\/\S*?\.vue$/)
          ? `webpack-generated:///${info.resourcePath}?${info.hash}`
          : `webpack-yourCode:///${info.resourcePath}`;

      config.output.devtoolFallbackModuleFilenameTemplate =
        "webpack:///[resource-path]?[hash]";
    }
  },
  devServer: {
    port: 5000,
  },
  pwa: {
    name: "Aac Dictation",
    themeColor: "#4DBA87",
    msTileColor: "#000000",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",

    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "src/service-worker.js",
    },
  },
};
