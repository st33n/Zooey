module.exports = {
  entry: './src/index.js',
  output: {
    path: './public/js',
    filename: 'zooey.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
}

