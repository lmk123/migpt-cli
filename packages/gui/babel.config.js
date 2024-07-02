// console.log('process.env.NODE_ENV', process.env.NODE_ENV)

// 对 node_modules 下的文件使用 babel-loader 参考了以下链接：
// @see https://stackoverflow.com/a/52415747

export default {
  sourceType: 'unambiguous',
  ignore: [/\/core-js/],
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        bugfixes: true,
        useBuiltIns: 'usage',
        corejs: '3',
        // 如果没有显示 debug 信息，那么需要将 webpack.config.js 中 babel-loader 的 cacheDirectory 改成 false
        debug: true,
      },
    ],
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
      },
    ],
    '@babel/preset-typescript',
  ],
}
