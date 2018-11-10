module.exports = require('./webpack.config-helper')({
  isProduction: false,
  devtool: 'cheap-eval-source-map',
  port: 1982,
  mode: 'development'
});