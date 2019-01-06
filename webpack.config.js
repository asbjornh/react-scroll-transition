const path = require("path");
const StaticSiteGeneratorPlugin = require("static-site-generator-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = () => {
  return {
    devServer: {
      disableHostCheck: true,
      inline: false,
      stats: "minimal"
    },
    entry: { demo: "./demo/index.js" },
    output: {
      path: path.resolve(__dirname + "/build"),
      filename: "[name].js",
      libraryTarget: "umd",
      globalObject: "this"
    },
    mode: "production",
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: ["babel-loader", "eslint-loader"]
        },
        {
          test: /\.css/,
          exclude: /node_modules/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: { importLoaders: 1 }
            }
          ]
        }
      ]
    },
    resolve: {
      extensions: [".js", ".jsx"]
    },
    plugins: [
      new MiniCssExtractPlugin({ filename: "style.css" }),
      new StaticSiteGeneratorPlugin({
        entry: "demo",
        paths: ["/"]
      })
    ]
  };
};
