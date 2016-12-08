var path = require('path'),
    fs = require('fs'),
    webpack = require('webpack'),
    ROOT = path.resolve(__dirname)

module.exports = {
  entry:{
    main: path.join(ROOT, 'main.js')
  },
  output: {
    path: path.join(ROOT, 'dist'),
    filename: '[name].js',
    publicPath: '/dist'
  },
  module: {
    loaders: [
      {test:/\.(js|jsx)$/, loader:'babel', exclude:/node_modules/}
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
  devServer:{
    historyApiFallback: true,
    hot: false,
    inline: true,
  },
  devtool: false
}
