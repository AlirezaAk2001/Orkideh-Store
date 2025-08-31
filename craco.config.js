module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.fallback = {
        buffer: require.resolve("buffer/"),
        stream: require.resolve("stream-browserify"),
        path: require.resolve("path-browserify"),
        os: require.resolve("os-browserify/browser"),
        crypto: require.resolve("crypto-browserify"),
        process: require.resolve("process/browser")
      };
      // اضافه کردن این خط برای اطمینان از تعریف گلوبال Buffer
      webpackConfig.plugins = webpackConfig.plugins || [];
      webpackConfig.plugins.push({
        apply: (compiler) => {
          compiler.hooks.afterEnvironment.tap("BufferPolyfill", () => {
            // این بخش برای اطمینان از بارگذاری Buffer هست
            // ولی معمولاً با polyfills.js کافی هست
          });
        },
      });
      return webpackConfig;
    },
  },
};