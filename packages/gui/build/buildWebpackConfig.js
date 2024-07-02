import path from 'node:path'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
// import CopyPlugin from 'copy-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import TerserJSPlugin from 'terser-webpack-plugin'
import OptimizeCSSAssetsPlugin from 'css-minimizer-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * 根据参数产出不同的 webpack 配置
 * @param mode {"production"|"development"}
 */
export default function buildWebpackConfig(mode) {
  const IS_PROD = mode === 'production'

  const outputPath = path.join(__dirname, '../dist/')

  const base = {
    mode,
    output: {
      publicPath: '',
      path: outputPath,
      clean: true,
    },
    entry: './src/index.tsx',
    module: {
      rules: [
        {
          test: /\.(woff2|ico|png|eot|svg|ttf|woff)$/i,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
          },
        },
        {
          test: /\.s?css$/i,
          oneOf: [
            {
              use: [
                // 官方推荐在 dev 模式时使用 style-loader，在 build 时才用 extract，
                // 但是内容脚本的样式不能注入到宿主页面的 dom 里，所以即使在 dev 模式下也抽离出来
                MiniCssExtractPlugin.loader,
                {
                  loader: 'css-loader',
                  options: {
                    importLoaders: 1,
                    esModule: false,
                  },
                },
                {
                  loader: 'postcss-loader',
                },
                'sass-loader',
              ],
            },
          ],
        },
        {
          test: /\.(tsx?|jsx?|mjs|cjs|js)$/,
          exclude: {
            and: [/node_modules/],
          },
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        },
      ],
    },
    plugins: [
      // new webpack.ProvidePlugin({
      //   process: 'process/browser',
      // }),
      new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './src/index.html',
      }),
      // new CopyPlugin({
      //   patterns: [{ from: 'public' }],
      // }),
    ],
    resolve: {
      modules: ['node_modules'],
      extensions: ['.tsx', '.ts', '.js'],
    },
    devServer: {
      static: {
        directory: path.join(__dirname, '../public'),
      },
      hot: true,
      open: true,
    },
  }

  const definePluginObj = {}
  if (mode === 'development') {
    base.devtool = 'inline-source-map'
  } else if (IS_PROD) {
    base.devtool = false
    base.optimization = {
      minimizer: [new TerserJSPlugin(), new OptimizeCSSAssetsPlugin()],
    }
  }
  base.plugins.push(new webpack.DefinePlugin(definePluginObj))

  if (IS_PROD) {
    base.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        // 不要将 report.html 放在 dist 里，因为 dist 里的文件会被复制过去作为 cli 包的一部分发布
        reportFilename: `../webpack-report.html`,
        openAnalyzer: false,
      }),
    )
  }

  return base
}
