#!/usr/bin/env node

import * as path from 'node:path'
import fse from 'fs-extra'
import { program } from 'commander'
// import { runServer } from './server'
import { run } from './childCtrl'

program
  .name('migpt-cli')
  .description('用于运行 MiGPT 的命令行工具。')
  .version('1.1.0')

program
  .command('init')
  .description('初始化配置文件。')
  .action(() => {
    const defaults = path.join(__dirname, '../migpt.defaults.json')
    const newConfig = path.resolve('migpt.json')
    fse.copySync(defaults, newConfig)
    console.log('初始化配置文件成功，文件位置：')
    console.log(newConfig)
    console.log(
      '注意：此配置文件仅仅是一个范本，你需要自行编辑其中的配置项之后才能成功运行 MiGPT！',
    )
  })

program
  .command('run', { isDefault: true })
  .description('根据配置文件运行 MiGPT。')
  .option('-c, --config <string>', '配置文件的路径。', 'migpt.json')
  .action((options) => {
    const json = fse.readJSONSync(options.config)
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
