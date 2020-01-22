const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: './renderer/index.js',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    path: path.join(__dirname, 'app'),
    publicPath: '/',
    filename: 'renderer.js'
  },
  devServer: {
    contentBase: './renderer'
  },
  target: 'electron-renderer',
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      DEBUG_PROD: false,
      START_MINIMIZED: false
    })
  ],
  node: {
    __dirname: false,
    __filename: false
  }
}
