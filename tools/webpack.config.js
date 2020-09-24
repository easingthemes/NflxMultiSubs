const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const { browsers, sourceDir, buildDir } = require('./config');

const mode = (process.env.NODE_ENV || 'production');
const isProd = mode === 'production';
const watch = !!process.env.WATCH;

const configs = browsers.map(browser => {
  const browserBuildDir = path.join(buildDir, browser);
  return {
    mode: mode,
    devtool: isProd ? false : 'inline-source-map',
    watch: watch,
    entry: {
      'background/background.min.js': path.join(sourceDir, 'background', 'background.js'),
      'content/content.min.js': path.join(sourceDir, 'content', 'content.js'),
      'popup/popup.min.js': path.join(sourceDir, 'popup', 'popup.js'),
      'lib/lib.min.js': path.join(sourceDir, 'lib', 'lib.js')
    },
    output: {
      path: browserBuildDir,
      filename: '[name]',
    },
    module: {
      rules: [
        {
          enforce: 'post',
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [['@babel/preset-env', { useBuiltIns: 'usage', corejs: 3 }]],
              plugins: ['@babel/plugin-transform-runtime', '@babel/plugin-proposal-object-rest-spread']
            }
          }
        },
        {
          test: /\.svg$/,
          loader: 'svg-inline-loader'
        }
      ]
    },
    plugins: [
      // new CleanWebpackPlugin(),
      new CopyWebpackPlugin({
        patterns: [
        {
          from: path.join(sourceDir, 'manifest.json'),
          transform: (content, path) => Buffer.from(JSON.stringify({
            short_name: process.env.npm_package_name,
            description: process.env.npm_package_description,
            version: process.env.npm_package_version,
            ...JSON.parse(content.toString('utf-8'))
          }, null, '\t')),
        }
      ]}),
      new webpack.DefinePlugin({
        VERSION: JSON.stringify(process.env.npm_package_version),
        BROWSER: JSON.stringify(browser),
      }),
    ],
  };
});

module.exports = configs;
