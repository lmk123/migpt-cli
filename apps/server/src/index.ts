#!/usr/bin/env node

import { runServer } from '@migptgui/server'
import path from 'node:path'
import { program } from 'commander'
import { fileURLToPath } from 'node:url'

program
  .option('-p, --port <number>', '后台服务的端口。')
  .option('--user <string>', '用户名。')
  .option('--pwd <string>', '密码。')
  .option('--open', '是否自动打开配置界面。')

program.parse()

const options = program.opts()

runServer({
  port: options.port,
  open: options.open,
  users:
    options.user && options.pwd ? { [options.user]: options.pwd } : undefined,
  staticPath: fileURLToPath(
    path.dirname(import.meta.resolve('@migptgui/gui')) + '/dist/',
  ),
})
