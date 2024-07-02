/** @type {import('jest').Config} */
const config = {
  rootDir: './',
  // 覆盖率相关设置
  collectCoverage: true,
  coverageDirectory: 'coverage',
  // 设为 false 才能正常显示 console.log，见 https://stackoverflow.com/a/53684761
  verbose: false,
  // 完全重置所有 mock 函数，详细说明见 https://github.com/lmk123/blog/issues/114
  clearMocks: true,
  transformIgnorePatterns: [
    // 为了确保 jest 将这些 esm 模块传给 transformer，需要将这些模块“反”排除
    'node_modules/(?!(node-fetch|lodash-es|date-fns|data-uri-to-buffer|fetch-blob|formdata-polyfill)/)',
  ],

  // 设置 monorepo
  projects: [
    {
      displayName: 'packages/options',
      testMatch: ['<rootDir>/packages/options/src/**/*.test.{ts,tsx}'],
    },
  ],
}

if (process.env.CI) {
  config.cacheDirectory = '.jest-cache'
}

// 虽然 jest 的文档上说 “Jest will copy the root-level configuration options to each individual child configuration during the test run”，
// 但实际使用中发现，下方的配置项需要明确添加后才能生效
const keys = ['clearMocks', 'cacheDirectory', 'transformIgnorePatterns']
config.projects.forEach((p) => {
  keys.forEach((key) => {
    if (p[key] == null && config[key] != null) {
      p[key] = config[key]
    }
  })
})

module.exports = config
