var path = require('path'),
    fs = require('fs'),
    webpack = require('webpack'),
    HtmlwebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require("extract-text-webpack-plugin")

var ROOT = path.resolve(__dirname),
    SRC = path.join(ROOT, 'src'),
    DIST = path.join(ROOT, 'dist'),
    extractCSS = new ExtractTextPlugin('lib.css'),
    extractStylus = new ExtractTextPlugin('main.css')

module.exports = {
  entry:{
    main: path.join(ROOT, 'main.js')
  },
  output: {
    path: DIST,
    filename: '[name].js',
    publicPath: '/dist'
  },
  module: {
    loaders: [
      {test:/\.(js|jsx)$/, loader:'babel', exclude:/node_modules/},
      {test:/\.css$/, loader:extractCSS.extract('style-loader', 'css-loader')},
      {test:/\.styl$/, loader:extractStylus.extract('style-loader', 'css-loader!stylus-loader')}
    ]
  },
  resolve:{
    extensions:['','.js'],
    alias: {
      'components': path.join(ROOT, 'src', 'components')
    } 
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'react-router': 'ReactRouter'                
  },
  babel: {
    presets: ['es2015','react'],
    plugins: ['transform-runtime']           
  },
  plugins: [
    extractCSS,
    extractStylus
  ],
  devServer:{
    historyApiFallback: true,
    hot: false,
    inline: true,
  },
  devtool: false
}
