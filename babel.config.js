/**
 * @fileOverview 这个配置是给 jest 用的，其它项目应该自己编写 babel config，例如 packages/gui/babel.config.js
 */

module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
      },
    ],
    '@babel/preset-typescript',
  ],
}
