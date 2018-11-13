const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { mapValues, mapKeys } = require('lodash');
const env = require('./env');


const PROD = process.env.NODE_ENV === 'production';

/**
 * Append hash suffix
 * @param {string} template
 * @param {string} hash
 * @return {*}
 */
const addHash = (template, hash) => template.replace(/\.[^.]+$/, `.[${hash}]$&`);

const config = {
  mode: PROD ? 'production' : 'development',

  entry: {
    app: [
      path.join(process.cwd(), 'src/root.js'),
    ],
  },

  output: {
    path: path.join(process.cwd(), 'build'),
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
  },

  resolve: {
    modules: ['node_modules', 'src'],
    extensions: ['.js'],
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            babelrc: true,
          },
        },
      },
      {
        // Preprocess own .css files
        // List of loaders, see https://webpack.js.org/loaders/#styling
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
      {
        // Preprocess 3rd party .css files located in node_modules
        test: /\.css$/,
        include: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(eot|otf|ttf|woff|woff2)$/,
        use: 'file-loader',
      },
      {
        test: /\.(png|jpg|jpeg|gif|ttf|eot|otf|woff|woff2)/,
        use: addHash('file-loader?name=[name].[ext]&outputPath=assets/', 'hash:6'),
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              // Inline files smaller than 10 kB
              limit: 10 * 1024,
              noquotes: true,
            },
          },
        ],
      },

      {
        test: /\.(mp4|webm)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
          },
        },
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/app.html'),
    }),

    new webpack.DefinePlugin(
      mapValues(
        mapKeys({
          NODE_ENV: process.env.NODE_ENV,
          ...env,
        }, (value, key) => `process.env.${key}`), value => JSON.stringify(value),
      ),
    ),

    new CopyWebpackPlugin([
      {
        from: 'src/assets',
        to: 'assets',
      },
    ]),
  ].filter(Boolean),

  target: 'web',

  devServer: {
    host: '0.0.0.0',
    disableHostCheck: true,
    port: env.PORT,
    publicPath: '/',
    historyApiFallback: true,
    stats: {
      hash: false,
      version: false,
      timings: true,
      assets: true,
      chunks: false,
      modules: false,
      cached: true,
      colors: true,
    },
    proxy: {
      '/api/ws': {
        target: `ws://localhost:${env.PROXY_API_PORT}`,
        logLevel: 'debug',
        ws: true,
      },
    },
  },
};

module.exports = config;
