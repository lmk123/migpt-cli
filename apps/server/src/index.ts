#!/usr/bin/env node

import { runServer } from '@migptgui/server'
import path from 'node:path'
import { program } from 'commander'

program
  .option('-p, --port <number>', '后台服务的端口。')
  .option('--open', '是否自动打开配置界面。')

program.parse()

const options = program.opts()

runServer({
  port: options.port,
  open: options.open,
  staticPath: path.join(
    path.dirname(require.resolve('@migptgui/gui')),
    './dist/',
  ),
})
