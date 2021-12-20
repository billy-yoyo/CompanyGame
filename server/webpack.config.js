const nodeExternals = require('webpack-node-externals');
const path = require('path');


module.exports = {
  mode: 'development',
  entry: './src/app.ts',
  module: {
      rules: [
          {
              test: /\.ts$/,
              use: 'ts-loader',
              exclude: /node_modules/
          }
      ]
  },
  resolve: {
      extensions: ['.ts'],
      modules: [
        'node_modules'
      ],
      alias: {
          '@common': path.join(__dirname, '../common/src')
      }
  },
  externals: [nodeExternals()],
  target: 'node',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'backend.js'
  }
}
