#!/usr/bin/env node

import * as path from 'node:path'
import fse from 'fs-extra'
import { program } from 'commander'
import { run } from '@migptgui/controller'

program
  .command('create')
  .description('创建一个机器人。')
  .argument('<name>', '用于保存机器人数据的文件夹的名称。')
  .action((name) => {
    const defaults = path.join(__dirname, '../migpt.defaults.json')
    const robotDir = path.resolve(name)
    const newConfig = path.join(robotDir, './migptgui.json')
    fse.copySync(defaults, newConfig)
    console.log('创建机器人成功，机器人位置：')
    console.log(robotDir)
    console.log('机器人配置文件的位置：')
    console.log(newConfig)
    console.log(
      '注意：此配置文件仅仅是一个范本，你需要自行编辑其中的配置项之后才能成功运行 MiGPT！',
    )
  })

program
  .command('run')
  .description('启动机器人。')
  .argument('<name>', '保存有机器人数据的文件夹的名字。')
  .action((name) => {
    const json = fse.readJSONSync(path.join(name, './migptgui.json'))
    run(json, name)
  })

program.parse()
