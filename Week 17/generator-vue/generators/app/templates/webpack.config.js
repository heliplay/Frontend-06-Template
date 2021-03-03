const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  mode: 'development', // development,production
  // target: 'web',
  entry: path.join(__dirname, 'src/main.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        exclude: /node_moudules/,
        use: {
          loader: 'vue-loader'
        }
      }
    ]
  },
  devServer: {
    host: '0.0.0.0',
    port: 9000
  },
  plugins: [
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '/src/index.html')
    })
  ]
}
