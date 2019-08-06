module.exports = {
  mode: 'production',
  entry: './src/app.js',
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules:[
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/
      },
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    }
  }
}