var path = require('path'),
    fs = require('fs'),
    webpack = require('webpack'),
    HtmlwebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    CleanPlugin = require('clean-webpack-plugin'),
    cssExtractor = new ExtractTextPlugin("css/lib.[contenthash:9].css"),
    stylExtractor = new ExtractTextPlugin("css/main.[contenthash:9].css")

var ROOT_PATH = path.resolve(__dirname),
    APP_PATH = path.resolve(ROOT_PATH, 'src'),
    DIST_PATH = path.resolve(ROOT_PATH, 'dist'),
    TMPL_PATH = path.resolve(APP_PATH, 'tmpl'),
    ENTRY_LIST = ['vendor'],
    ENTRY_PATHS = {
      vendor: ['redux', 'react-redux', 'redux-thunk']
    }

var files = fs.readdirSync(APP_PATH),
    entryObj = {}
files.forEach(function(filename) {
  if(/[\s\S]+\.js$/.test(filename)) {
    ENTRY_LIST.push( filename.match(/([\s\S]+)\.js$/)[1] )
    ENTRY_PATHS[ filename.match(/([\s\S]+)\.js$/)[1] ] = path.resolve(APP_PATH, filename)
  }
})

module.exports = {
  entry: ENTRY_PATHS,
  output: {
    path: DIST_PATH,
    filename: 'js/[name].[chunkhash:8].js',
    chunkFilename: 'js/[name].[chunkhash:8].js',
    // publicPath: '/'
  },
  module:{
    loaders:[
      {test:/\.(js|jsx)$/, loader:'babel', exclude:/node_modules/},
      {test:/\.styl$/, loader: stylExtractor.extract('style', 'css!stylus', {publicPath: '../'})},
      {test:/\.css$/, loader: cssExtractor.extract('style', 'css', {publicPath: '../'})},
      {test:/\.(png|jpg|gif)$/, loader:'url?limit=8192&name=img/[name].[ext]?[hash]'},
      {test:/\.(eot|svg|ttf|TTF|woff)$/, loader:'url?limit=1000&name=font/[name].[ext]?[hash]'}
    ]
  },
  resolve:{
    extensions:['', '.js', '.jsx'],
    alias:{
      components: path.resolve(APP_PATH,'components'),
      utils: path.resolve(APP_PATH, 'utils'),
      css: path.resolve(APP_PATH, 'css')
    }
  },
  babel: {
    presets: ['es2015','react', 'stage-1'],
    plugins: ['transform-runtime']
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'react-router': 'ReactRouter',
    'immutable': 'Immutable',
    'draft-js': 'Draft',
  },
  plugins: [
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(
                  process.env.NODE_ENV === 'dev' ? 'dev'
                                                 : 'production')
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor'],
      minChunks: 2
    }),
    new CleanPlugin(['dist'], {
      root: ROOT_PATH,
      verbose: true,
      dry: true
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      mangle: false,
      minimum: true,
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    cssExtractor,
    stylExtractor,
    new HtmlwebpackPlugin({
      title: 'react demo',
      template: path.resolve(TMPL_PATH, 'index.html'),
      filename: 'index.html',
      chunks: ['vendor', 'dev'],
      inject: 'body'
    }),
    new HtmlwebpackPlugin({
      title: 'dev demo',
      template: path.resolve(TMPL_PATH, 'index.html'),
      filename: 'dev.html',
      chunks: ['vendor', 'main'],
      inject: 'body'
    })
  ],
  devServer:{
    historyApiFallback: true,
    hot: false,
    inline: true,
    proxy:{
      '/api/*':{
        target: 'http://127.0.0.1:4000',
        secure: false
      }
    }
  },
  devtool: false
}
