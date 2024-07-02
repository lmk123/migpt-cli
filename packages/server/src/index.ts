import path from 'node:path'
import express from 'express'
import open from 'open'
import os from 'node:os'
import { getStatus, type RunConfig, run, stop } from '@migptgui/controller'
import fs from 'node:fs/promises'
import fse from 'fs-extra'
import { createTTS } from 'mi-gpt-tts'
import { Readable } from 'node:stream'
import ip from 'ip'
import { type GuiConfig } from '@migptgui/options'
import baseAuth from 'express-basic-auth'
import { nanoid } from 'nanoid'

export function runServer(options?: {
  open?: boolean
  port?: number
  users?: Record<string, string>
  staticPath?: string
}) {
  const port = options?.port || 36592

  const isAuth = !!options?.users
  const ttsSecret = nanoid()
  const ttsSecretPath = '/' + ttsSecret
  const ttsPath = ttsSecretPath + '/tts/tts.mp3'

  const app = express()

  // 小爱音箱会通过这个接口获取语音合成的音频，所以不能给它加 basicAuth
  app.get(ttsPath, (req, res) => {
    // console.log('master: 进入 /tts/tts.mp3')
    if (!tts) {
      res.status(500).send('TTS not initialized')
      return
    }

    const options: Record<string, unknown> = {}
    const nUrl = req.url.replace('+text=', '&text=') // 修正请求 URL
    const url = new URL('http://localhost' + nUrl)
    for (const [key, value] of url.searchParams.entries()) {
      options[key] = value
    }

    const audioStream = new Readable({ read() {} })
    options.stream = audioStream

    // console.log('master: 开始合成语音。配置：', options)

    tts(options)

    res.writeHead(200, {
      'Transfer-Encoding': 'chunked',
      'Content-Type': 'audio/mp3',
    })

    audioStream.pipe(res)
  })

  app.use(express.json())

  if (options?.users) {
    app.use(baseAuth({ users: options.users, challenge: true }))
  }

  if (options?.staticPath) {
    app.use(express.static(options.staticPath))
  }

  let tts: ReturnType<typeof createTTS>

  app.get('/api/status', async (req, res) => {
    res.json(getStatus())
  })

  // 在自己运行 tts 服务时需要有一个局域网或公网 IP 地址给小爱音箱来访问下面的 /tts/tts.mp3 接口
  app.get('/api/myip', (req, res) => {
    res.json({ ip: ip.address('public') })
  })

  // 删除机器人配置
  app.delete('/api/default', (req, res) => {
    fs.unlink(path.join(os.homedir(), '.migptgui/default/')).then(
      () => {
        res.json({ success: true })
      },
      (err) => {
        res.json({ success: false, error: err })
      },
    )
  })

  app.post('/api/start', async (req, res) => {
    const migptConfig = req.body as GuiConfig

    // 如果使用了内置的 TTS 服务
    if (
      migptConfig.config.speaker.tts === 'custom' &&
      migptConfig.tts &&
      migptConfig.gui
    ) {
      tts = createTTS(migptConfig.tts)
      migptConfig.env.TTS_BASE_URL = `http://${migptConfig.gui.publicIP}:${port}${ttsSecretPath}/tts`
      // console.log('内建 TTS 服务地址：', migptConfig.env.TTS_BASE_URL)
    }

    // console.log('master: 收到 /api/start', migptConfig)

    const cwd = path.join(os.homedir(), '.migpt/default/')
    await fse.ensureDir(cwd)
    await run(migptConfig as RunConfig, cwd)

    res.json({ success: true })
  })

  app.post('/api/stop', async (req, res) => {
    // console.log('master: 收到 /api/stop')

    await stop()

    res.json({ success: true })
  })

  app.listen(port, () => {
    console.log('端口：', port)
    console.log('登录认证：', isAuth ? '已启用' : '未启用')
    if (options?.open) {
      open(`http://localhost:${port}`)
    }
  })
}
