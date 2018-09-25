const VueLoaderPlugin = require('vue-loader/lib/plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: ['./app.js', './scss/main.scss'],
    output: {
        filename: 'dist/bundle.js'
    },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test:/\.(s*)css$/,
        use: ExtractTextPlugin.extract({
              fallback:'style-loader',
              use:['css-loader','sass-loader'],
          })
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new ExtractTextPlugin({filename:'app.bundle.css'}),
  ]
};