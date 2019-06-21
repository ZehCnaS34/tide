const R = require("ramda");
const path = require("path");
const nodeExternals = require("webpack-node-externals");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

const MONACO_DIR = path.resolve(__dirname, "./node_modules/monaco-editor");
const APP_DIR = path.resolve(__dirname, "./src");

const clientConfig = {
  test: /.js$/,
  exclude: /node_modules/,
  use: {
    loader: "babel-loader",
    options: {
      presets: [
        [
          "@babel/preset-env",
          {
            useBuiltIns: "entry"
          }
        ],
        "@babel/preset-react",
        "@babel/preset-flow"
      ],
      plugins: [
        "@babel/plugin-transform-regenerator",
        "@babel/plugin-syntax-dynamic-import",
        "@babel/plugin-proposal-class-properties",
        // [
        //   "@babel/plugin-proposal-decorators",
        //   {
        //     decoratorsBeforeExport: true
        //   }
        // ]
      ]
    }
  }
};

const serverConfig = {
  test: /.js$/,
  exclude: /node_modules/,
  use: {
    loader: "babel-loader",
    options: {
      presets: ["@babel/preset-flow"]
    }
  }
};

const config = {
  mode: "development",
  module: {
    rules: [
      {
        use: "babel-loader",
        exlude: /node_modules/
      }
    ]
  }
};

const output = [
  R.mergeDeepRight(config, {
    entry: ["@babel/polyfill", "./src/ui/index.js"],
    // entry: "./src/ui/index.js",
    output: {
      filename: "bundle.js",
      publicPath: "/dist/",
      chunkFilename: "[name].chunk.js",
      path: path.resolve(__dirname, "dist")
    },
    plugins: [
      new MonacoWebpackPlugin({
        // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
        languages: [
          "json",
          "javascript",
          "rust",
          "ruby",
          "python",
          "sql",
          "shell"
        ]
      })
    ],
    module: {
      rules: [
        clientConfig,
        {
          test: /\.css$/i,
          include: APP_DIR,
          use: ["style-loader", "css-loader"]
        },
        {
          test: /\.css$/,
          include: MONACO_DIR,
          use: ["style-loader", "css-loader"]
        }
      ]
    }
  }),
  R.mergeDeepRight(config, {
    entry: "./src/server/index.js",
    target: "node",
    externals: [nodeExternals()],
    output: {
      filename: "index.js",
      path: path.resolve(__dirname, "lib"),
      library: "tideServer",
      libraryTarget: "umd"
    },
    module: {
      rules: [serverConfig]
    }
  })
];

module.exports = output;
