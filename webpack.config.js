const HtmlWebpackPlugin = require("html-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const Dotenv = require("dotenv-webpack");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";
  const isAnalyzerEnabled = env && env.analyze;

  const plugins = [
    new HtmlWebpackPlugin({
      template: "./public/index.html", // Specify your HTML template here
    }),
    new CopyPlugin({
      patterns: [
        // { from: path.resolve(__dirname, "public"), to: "" },
        { from: path.resolve(__dirname, "src/robots.txt"), to: "robots.txt" },
      ],
    }),
  ];

  if (!isProduction) {
    plugins.push(new Dotenv());
  }

  if (isProduction) {
    plugins.push(
      new webpack.DefinePlugin({
        "process.env.SUPABASE_URL": JSON.stringify(process.env.SUPABASE_URL),
        "process.env.SUPABASE_ANON_KEY": JSON.stringify(
          process.env.SUPABASE_ANON_KEY
        ),
        "process.env.IMAGE_EXPORT_URL": JSON.stringify(
          process.env.IMAGE_EXPORT_URL
        ),
      })
    );
  }

  if (isAnalyzerEnabled) {
    plugins.push(new BundleAnalyzerPlugin());
  }

  return {
    entry: "./src/index.tsx",
    output: {
      filename: "[name].[contenthash].bundle.js",
      chunkFilename: "[name].[contenthash].chunk.js",
      path: path.resolve(__dirname, "dist"),
      clean: true, // Cleans the /dist folder on each build
      publicPath: "/",
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx|js|jsx)$/,
          exclude: /node_modules/,
          use: [
            "magic-comments-loader",
            {
              loader: "babel-loader", // Babel Loader to use babel.config.js settings
            },
            {
              loader: "ts-loader",
              options: {
                transpileOnly: true, // Speeds up compilation without type checking
              },
            },
          ],
        },
        {
          test: /\.s?css$/,
          use: ["style-loader", "css-loader", "sass-loader"], // Loaders for styling
        },
      ],
    },
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx"],
      alias: {
        supabase: path.resolve(__dirname, "src/supabaseClient.ts"),
        "@store": path.resolve(__dirname, "src/store"),
        "@components": path.resolve(__dirname, "src/components"),
      },
    },
    plugins: plugins,
    devServer: {
      static: { directory: path.join(__dirname, "dist") },
      compress: true,
      port: 3000,
      hot: true, // Enables Hot Module Replacement
      historyApiFallback: true, // Serves index.html for all 404 routes
    },
    optimization: {
      minimizer: [new TerserPlugin({ extractComments: false })],
      splitChunks: {
        chunks: "all", // Splits chunks for all types of imports
      },
    },
  };
};
