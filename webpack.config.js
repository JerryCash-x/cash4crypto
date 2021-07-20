const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'
console.log('is dev', isDev)
const isProd = !isDev

const optimization = () => {
    const config = {
      splitChunks: {
        chunks: 'all'
      }
    }
  
    if(isProd) {
      config.minimizer = [
        new OptimizeCssAssetWebpackPlugin(),
        new TerserWebpackPlugin()
      ]
    }
    return config
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

const cssLoaders = extra => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: isDev,
        reloadAll:  true
      }
    },
    {
      loader: 'css-loader'
    },
    {
      loader: 'postcss-loader',
      options: {
        ident: 'postcss',
        plugins: [
          require('tailwindcss'),
          require('autoprefixer'),
        ],
      },
    },
  ]
  if (extra) {
    loaders.push(extra)
  }

  return loaders
}

const plugins = () => {
  const base = [
    new HtmlWebpackPlugin({
      template: './index.html',
      minify: {
        collapseWhitespace: isProd
      },
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
          { from: './assets/imgs/', to: '../dist/img' },
          { from: './assets/styles/', to: '../dist/styles' },
      ]
    }),
    new MiniCssExtractPlugin({
      filename: filename('css')
    })
  ]
  
  return base
}

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development', 
    entry: {
        main: path.resolve(__dirname, './src/app/index.js'),
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].bundle.js',
    },
    optimization: optimization(),
    devServer: {
      port: 4200,
      hot: isDev
    },
    plugins: plugins()
}