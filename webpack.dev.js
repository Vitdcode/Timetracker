const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const DotenvWebpackPlugin = require('dotenv-webpack');
module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
    watchFiles: ['./src/index.html'],
    hot: true,
  },
  plugins: [new DotenvWebpackPlugin()],
});
