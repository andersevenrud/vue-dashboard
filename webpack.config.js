const path = require('path');
const Webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

const IS_PRODUCTION = String(process.env.NODE_ENV).match(/^prod/i);

module.exports = {
  devtool: 'source-map',

  entry: {
    app: [
      './src/app.js',
      './src/app.scss'
    ]
  },

  plugins: [
    new WebpackNotifierPlugin(),
    new Webpack.DefinePlugin({
      PRODUCTION: IS_PRODUCTION
    }),
    new Webpack.optimize.UglifyJsPlugin({
      minimize: IS_PRODUCTION,
      sourceMap: true
    }),
    new Webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      chunks: ['app'],
      minChunks: (m) => {
        const context = m.context;
        if ( typeof context !== 'string' ) {
          return false;
        }
        return context.indexOf('node_modules') !== -1;
      }
    }),
    new HtmlWebpackPlugin({
      template: path.resolve('./src/index.html')
    }),
    new ExtractTextPlugin('[name].css'),
    IS_PRODUCTION ? null : new LiveReloadPlugin({

    })
  ].filter((p) => !!p),

  output: {
    path: path.resolve('./dist'),
    sourceMapFilename: '[file].map',
    filename: '[name].js'
  },

  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(png|jpe?g|ico)$/,
        loader: 'file-loader'
      },
      {
        test: /((\w+)\.(eot|svg|ttf|woff|woff2))$/,
        loader: 'file-loader?name=fonts/[name].[ext]'
      },
      {
        test: /\.s?css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: IS_PRODUCTION,
                sourceMap: true
              }
            },
            {
              loader: 'sass-loader',
              options: {
                minimize: IS_PRODUCTION,
                sourceMap: true,
                includePaths: [
                  path.resolve('./src/sass'),
                  'node_modules',
                  path.resolve('./node_modules')
                ]
              }
            }
          ]
        })
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
        }
      }
    ]
  }
};
