import buildWebpackConfig from './build/buildWebpackConfig.js'

export default (env) => {
  return buildWebpackConfig(env.mode)
}
