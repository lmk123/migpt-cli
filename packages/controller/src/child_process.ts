/**
 * @fileOverview 用于运行 MiGPT 的子进程。
 * 使用子进程是因为一旦 import 'mi-gpt' 模块，它就会从环境变量中获取一些配置并且之后都不再改变，
 * 所以为了在 MiGPT 的代码执行前就配置好环境变量，需要在子进程中运行 MiGPT。
 */

import { MiGPT, type MiGPTConfig } from 'mi-gpt'

let migpt: MiGPT | undefined

process.on('message', (msg: any) => {
  if (msg.type === 'destroy') {
    if (migpt) {
      migpt.stop().then(() => {
        process.exit(0)
      })
    } else {
      process.exit(0)
    }
  } else if (msg.type === 'run') {
    const config = msg.config as MiGPTConfig
    // console.log('配置：\n', config)
    const migpt = MiGPT.create(config)
    migpt.start()
  }
})
