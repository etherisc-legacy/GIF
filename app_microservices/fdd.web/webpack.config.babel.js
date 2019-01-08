import fs from 'fs-jetpack';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import path from 'path';
import mapValues from 'lodash/mapValues';
import project from './project.config';


const ENV = process.env.NODE_ENV;
const DEV = true; // ENV === 'development';
const PROD = ENV === 'production';

const {
  VENDORS = [],
  HOST = '0.0.0.0',
  PORT = '8082',
  copy = [],
  proxy = {},
} = project;

const CONSTANTS = {};
Object.keys(project.constants).forEach((key) => {
  CONSTANTS[`process.env.${key}`] = project.constants[key];
});

/**
 * @param {string} src
 * @return {{}}
 */
const getEntries = (src) => {
  const entries = {};
  fs.list(src).forEach((item) => {
    const resource = path.join(src, item);
    if (fs.inspect(resource).type === 'file') {
      entries[item.split('.')[0]] = [
        DEV && 'react-hot-loader/patch',
        DEV && `webpack-dev-server/client?http://${HOST}:${PORT}`,
        DEV && 'webpack/hot/only-dev-server',
        resource,
      ].filter(Boolean);
    }
  });

  return entries;
};

/**
 * @param {string} template
 * @param {string} hash
 * @return {string}
 */
const addHash = (template, hash) => template.replace(/\.[^.]+$/, `.[${hash}]$&`);

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'src');
const DEST = path.join(ROOT, 'build');
const ENTRY = getEntries(path.join(SRC, 'entries'));
const HASH = DEV ? 'hash' : 'chunkhash';

const css = new ExtractTextPlugin(addHash('css.css', HASH));

const POSTCSS_LOADER = {
  loader: 'postcss-loader',
  options: {
    plugins: () => [
      require('postcss-font-magician'),
      require('autoprefixer'),
      require('postcss-nested'),
    ],
  },
};

ENTRY.vendors = VENDORS;

// Webpack configuration
const config = {
  entry: ENTRY,

  output: {
    path: DEST,
    filename: addHash('[name].js', HASH),
    publicPath: '/',
  },

  devtool: DEV ? 'cheap-inline-module-source-map' : 'source-map',

  cache: DEV,

  resolve: {
    extensions: ['.js'],
    modules: [
      SRC,
      'node_modules',
    ],
    mainFiles: ['index'],
    alias: {
      moment$: 'moment/moment.js',
    },
  },

  watchOptions: {
    aggregateTimeout: 100,
  },

  profile: true,

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: ['babel-loader', 'webpack-conditional-loader'],
        include: /src/,
      },

      {
        test: /\.json$/,
        loader: 'json-loader',
      },

      {
        test: /\.(png|jpg|jpeg|gif|svg|ttf|eot|woff|woff2)/,
        use: addHash('file-loader?name=[name].[ext]&outputPath=assets/', 'hash:6'),
      },

      {
        test: /^((?!\.m).)*\.css$/,
        use: DEV ? [
          'style-loader',
          'css-loader',
          POSTCSS_LOADER,
        ] : css.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            POSTCSS_LOADER,
          ],
        }),
      },

      {
        test: /(\.m\.css$)/,
        use: DEV ? [
          'style-loader',
          `css-loader?modules&importLoaders=1&context=${SRC}&localIdentName=[path]_[name]_[local]`,
          POSTCSS_LOADER,
        ] : css.extract({
          fallback: 'style-loader',
          use: [
            `css-loader?modules&importLoaders=1&context=${SRC}&localIdentName=[path]_[name]_[local]`,
            POSTCSS_LOADER,
          ],
        }),
      },
    ],
  },

  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),

    new CopyWebpackPlugin(copy, { copyUnmodified: true }),

    css,

    new webpack.optimize.CommonsChunkPlugin({ name: 'vendors', minChunks: Infinity }),

    new webpack.optimize.CommonsChunkPlugin({ name: 'runtime' }),

    new webpack.ProvidePlugin({
      Promise: 'es6-promise-promise',
    }),

    new webpack.DefinePlugin(mapValues({
      'process.env.NODE_ENV': ENV,
      ...CONSTANTS,
    }, v => JSON.stringify(v))),

    new webpack.LoaderOptionsPlugin({
      options: {
        context: '/',
      },
    }),

    new HtmlWebpackPlugin({
      inject: 'body',
      template: 'src/index.html',
    }),

    DEV && new webpack.HotModuleReplacementPlugin(),

    new webpack.NoEmitOnErrorsPlugin(),

    PROD && new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true,
        unsafe: true,
        screw_ie8: true,
      },
    }),
  ].filter(Boolean),

  devServer: {
    publicPath: '/',
    contentBase: SRC,
    hot: true,
    historyApiFallback: true,
    host: HOST,
    port: PORT,
    proxy,
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
  },
};

export default config;
