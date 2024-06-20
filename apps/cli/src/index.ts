#!/usr/bin/env node

import { program } from 'commander'
// import { runServer } from './server'
import * as fs from 'node:fs'
import { run } from './childCtrl'

program
  .name('migpt-cli')
  .description('用于运行 MiGPT 的命令行工具。')
  .version('1.1.0')

program
  .command('run', { isDefault: true })
  .description('根据配置文件运行 MiGPT。')
  .option('-c, --config <string>', '配置文件的路径。', 'migpt.json')
  .action((options) => {
    const jsonStr = fs.readFileSync(options.config, 'utf-8')

    const json = JSON.parse(jsonStr)

    run(json)
  })

program.parse(process.argv)

// program
//   .command('server')
//   .description('启动后台服务。')
//   .option('-p, --port <number>', '后台服务的端口。')
//   .option('--open', '是否在浏览器中打开配置页面。')
//   .action((str, options) => {
//     runServer(options)
//   })
