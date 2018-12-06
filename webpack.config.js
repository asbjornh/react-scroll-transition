const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const StaticSiteGeneratorPlugin = require("static-site-generator-webpack-plugin");

module.exports = () => {
  return {
    entry: {
      index: ["./demo/index.js"]
    },
    output: {
      path: path.resolve(__dirname + "/build"),
      filename: "[name].js",
      libraryTarget: "umd"
    },
    devServer: {
      stats: "minimal",
      inline: false
    },
    node: {
      fs: "empty"
    },
    module: {
      rules: [
        {
          test: require.resolve("react"),
          loader: "expose-loader?React"
        },
        {
          test: require.resolve("react-dom"),
          loader: "expose-loader?ReactDOM"
        },
        {
          test: require.resolve("react-dom/server"),
          loader: "expose-loader?ReactDOMServer"
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: ["babel-loader", "eslint-loader"]
        },
        {
          test: /\.css/,
          exclude: /node_modules/,
          use: ExtractTextPlugin.extract([
            {
              loader: "css-loader",
              options: {
                importLoaders: 1
              }
            }
          ])
        }
      ]
    },
    resolve: {
      extensions: [".js", ".jsx"]
    },
    plugins: [
      new ExtractTextPlugin("[name].[chunkhash].css"),
      new StaticSiteGeneratorPlugin({
        entry: "index",
        paths: ["/"]
      })
    ]
  };
};
