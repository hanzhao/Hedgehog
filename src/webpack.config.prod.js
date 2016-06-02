const webpack = require('webpack')

module.exports = {
  context: `${__dirname}/views`,
  entry: {
    main: [
      './index.js'
    ]
  },
  output: {
    path: `${__dirname}/public`,
    filename: '[name].bundle.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'stage-0', 'react'],
          plugins: ['transform-decorators-legacy', 'antd']
        }
      }, {
        test: /\.scss$/,
        exclude: /node_modules/,
        loaders: ['style', 'css?modules&importLoaders=1', 'postcss', 'sass']
      }, {
        test: /\.css$/,
        loaders: ['style', 'css']
      }, {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
        loaders: ['url?limit=10000']
      }, {
        test: /\.(eot|ttf|wav|mp3)$/,
        loaders: ['file']
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json', '.scss']
  },
  postcss: [
    require('autoprefixer')({ browsers: ['last 3 versions'] })
  ]
}
