const buildWebpackConfig = require('./build/buildWebpackConfig')

module.exports = (env) => {
  return buildWebpackConfig(env.mode)
}
