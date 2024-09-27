import path from 'node:path'
import express from 'express'
import open from 'open'
import os from 'node:os'
import { getStatus, type RunConfig, run, stop } from '@migptgui/controller'
import fse from 'fs-extra'
import fs from 'node:fs/promises'
import { createTTS, kTTSSpeakers } from 'mi-gpt-tts'
import { Readable } from 'node:stream'
// import ip from 'ip'
import { type GuiConfig } from '@migptgui/options'
import baseAuth from 'express-basic-auth'
import { nanoid } from 'nanoid'
import _trimEnd from 'lodash/trimEnd.js'
import createDebug from 'debug'

const dDefault = createDebug('@migptgui/server:default')
// dDefault.enabled = true

const dRoute = createDebug('@migptgui/server:route')
// dRoute.enabled = true

const dAudio = createDebug('@migptgui/server:audio')
// dAudio.enabled = true

export function runServer(options?: {
  open?: boolean
  port?: number
  users?: Record<string, string>
  staticPath?: string
}) {
  const port = options?.port || 36592

  const defaultBotCwd = path.join(os.homedir(), '.migptgui/default/')

  let guiConfigRunning: GuiConfig | undefined

  const isAuth = !!options?.users
  const ttsSecret = nanoid()
  const ttsSecretPath = '/' + ttsSecret
  const ttsPath = ttsSecretPath + '/tts/tts.mp3'
  const ttsSpeakersPath = ttsSecretPath + '/tts/speakers'

  async function saveConfig(config: GuiConfig) {
    await fse.ensureDir(defaultBotCwd)
    return fs.writeFile(
      path.join(os.homedir(), '.migptgui/default/migptgui.json'),
      JSON.stringify(config),
    )
  }

  const app = express()

  // 用于测试用户填写的对外地址是否正确
  app.post('/ping', (req, res) => {
    dRoute('进入 POST /ping')
    res.status(204).send()
  })

  // mi-gpt 会通过这个接口获取可用的音色列表，用于通过【切换音色关键词】来切换音色
  app.get(ttsSpeakersPath, (req, res) => {
    dRoute('进入 GET /tts/speakers，`req.query`：%O', req.query)
    res.json(kTTSSpeakers)
  })

  // 小爱音箱会通过这个接口获取语音合成的音频，所以不能给它加 basicAuth
  app.get(ttsPath, (req, res) => {
    dRoute('进入 GET /tts/tts.mp3，`req.url`：%s', req.url)
    // req.url 会是这么个格式：`/tts/tts.mp3?speaker=zh-CN-liaoning-XiaobeiNeural+text=要朗读的文本`
    // 其中要注意的是：
    // - speaker 与 text 参数中间用的是加号 + 来连接，而不是 &，所以需要先修正一下
    // - speaker 参数一般是空的，但是，如果用户通过【切换音色关键词】换过音色，那么这个参数就会有值，例如 zh-CN-liaoning-XiaobeiNeural

    // 没有启动 MiGPT，或者没有配置过 tts
    if (!guiConfigRunning || !guiConfigRunning.tts) {
      dDefault('没有启动 MiGPT，或者没有配置过 tts，所以返回 500')
      res.status(500).send('Internal Server Error')
      return
    }

    const tts = createTTS(guiConfigRunning.tts)

    const nUrl = req.url.replace('+text=', '&text=') // 修正请求 URL
    const url = new URL('http://localhost' + nUrl)
    const audioStream = new Readable({ read() {} })

    const options = {
      // 指定 speaker 的原因见 `/api/test/audio` 接口的注释
      speaker:
        url.searchParams.get('speaker') || guiConfigRunning.tts.defaultSpeaker!,
      text: decodeURIComponent(url.searchParams.get('text') || ''),
      stream: audioStream,
    }

    dAudio('准备合成语音。参数：%O', options)

    tts(options)
      // 错误处理的代码是复制的 `/api/test/audio` 接口里的
      .then((buffer) => {
        if (!buffer) {
          // 没有填写配置的时候，会走到这里面来
          audioStream.destroy(new Error('没有把配置填写完整'))
        }
      })

    let headersSent = false

    audioStream.on('data', (chunk) => {
      if (
        (chunk.length === 3 && chunk.toString('utf8') === '404') ||
        (chunk.length === 5 && chunk.toString('utf8') === 'error')
      ) {
        audioStream.destroy(new Error('配置填写有误'))
        return
      }

      // 到了这里才可以确保这次是正常响应了
      if (!headersSent) {
        res.writeHead(200, {
          'Transfer-Encoding': 'chunked',
          'Content-Type': 'audio/mp3',
        })
        headersSent = true
      }

      // 流式响应数据
      res.write(chunk)
    })

    audioStream.on('end', () => {
      res.end()
    })

    audioStream.once('error', (error) => {
      if (!headersSent) {
        res.status(400).send(error.message || 'Internal Server Error')
      } else {
        res.end()
      }
    })
  })

  app.use(express.json())

  if (options?.users) {
    app.use(baseAuth({ users: options.users, challenge: true }))
  }

  if (options?.staticPath) {
    app.use(express.static(options.staticPath))
  }

  app.get('/api/status', async (req, res) => {
    const s = getStatus()
    dRoute('进入 GET /api/status，响应：%O', s)
    res.json(s)
  })

  // 测试对外地址是否能连通
  app.post('/api/test', async (req, res) => {
    const testBaseUrl = req.body.url
    const ping = _trimEnd(testBaseUrl, '/') + '/ping'
    dRoute(
      '进入 POST /api/test，url 参数为：%s；拼接后的 ping 接口地址为：%s',
      testBaseUrl,
      ping,
    )
    try {
      const fetchRes = await fetch(ping, {
        method: 'POST',
        signal: AbortSignal.timeout(500),
      })
      if (fetchRes.ok) {
        res.json({
          success: true,
        })
      } else {
        res.json({
          success: false,
        })
      }
    } catch (e) {
      res.json({
        success: false,
      })
    }
  })

  app.get('/api/test/audio', (req, res) => {
    dRoute('进入 GET /api/test/audio，query 参数：%O', req.query)

    const params = req.query as { ttsConfig: string }
    const options = JSON.parse(params.ttsConfig)
    const testTTS = createTTS(options)

    const audioStream = new Readable({ read() {} })
    options.stream = audioStream

    const ro = {
      text: '配置成功！',
      stream: audioStream,
      // 关于 defaultSpeaker：
      // mi-gpt-tts 支持三种 tts 服务，但是，这三种服务是耦合在一起的。
      // 举个例子：我同时配置了 edge 和 volcano，如果我不指定 defaultSpeaker，那么 mi-gpt-tts 会默认使用 volcano；
      // 如果我想要使用 edge，那么我需要在配置中指定 defaultSpeaker 为 edge 所支持的 speaker 比如“云希”。
      //
      // 同时，mi-gpt-tts 会将第一次调用的 defaultSpeaker 作为之后所有朗读的 speaker，举个例子，如果我第一次朗读时 defaultSpeaker 为“云希”，
      // 那么之后所有的朗读都会使用 edge，如果我在这之后把 defaultSpeaker 切换为了 volcano 的“灿灿”，它仍然是用 edge 的“云希”朗读的。
      // 为了解决这个问题，需要每次调用都指定下面的 speaker，这个可以强制要求 mi-gpt-tts 使用指定的 speaker。
      speaker: options.defaultSpeaker,
    }

    dAudio('在语音测试接口中，开始合成语音。配置：%O', ro)

    testTTS(ro)
      // 以下错误处理的目的是如果判断到错误就让响应迅速中断，不然的话响应会一直挂起，导致配置界面 / 小爱音箱长时间处于无反应的状态
      .then((buffer) => {
        if (!buffer) {
          // 没有填写配置的时候，会走到这里面来
          audioStream.destroy(new Error('没有把配置填写完整'))
        }
      })

    let headersSent = false

    audioStream.on('data', (chunk) => {
      // console.log('data 事件数据长度：', chunk.length)

      // 如果填写了配置但是填写的不对，则第一次会推送过来一个 404
      // __但奇怪的是我没有在 mi-gpt-tts 里找到这个 404 的推送，先不管了__
      // 破案了。
      // npm 上发布的是 v2.0.0 的 mi-gpt-tts，当时它推送的确实是 "404"，见
      // https://github.com/idootop/mi-gpt-tts/blob/v2.0.0/src/common/stream.ts#L30
      // github 上现在是 v3.0.0 的，它给改成 "error" 了，见
      // https://github.com/idootop/mi-gpt-tts/blob/v3.0.0/src/common/stream.ts#L30
      if (
        (chunk.length === 3 && chunk.toString('utf8') === '404') ||
        (chunk.length === 5 && chunk.toString('utf8') === 'error')
      ) {
        audioStream.destroy(new Error('配置填写有误'))
        return
      }

      // 到了这里才可以确保这次是正常响应了
      if (!headersSent) {
        res.writeHead(200, {
          'Transfer-Encoding': 'chunked',
          'Content-Type': 'audio/mp3',
        })
        headersSent = true
      }

      // 流式响应数据
      res.write(chunk)
    })

    audioStream.on('end', () => {
      res.end()
    })

    audioStream.once('error', (error) => {
      if (!headersSent) {
        res.status(400).send(error.message || 'Internal Server Error')
      } else {
        res.end()
      }
    })
  })

  // 在自己运行 tts 服务时需要有一个局域网或公网 IP 地址给小爱音箱来访问下面的 /tts/tts.mp3 接口
  // app.get('/api/myip', (req, res) => {
  //   res.json({ ip: ip.address('public') })
  // })

  // 读取配置
  app.get('/api/default', async (req, res) => {
    dRoute('进入 GET /api/default')
    let migptConfig: GuiConfig | undefined

    try {
      const migptConfigStr = await fs.readFile(
        path.join(defaultBotCwd, 'migptgui.json'),
        'utf-8',
      )
      migptConfig = JSON.parse(migptConfigStr)
    } catch (e) {
      // console.log('master: 读取默认配置文件失败：', e)
    }
    if (migptConfig) {
      res.json({
        config: migptConfig,
      })
    } else {
      res.json({})
    }
  })

  // 保存配置
  app.put('/api/default', async (req, res) => {
    const migptConfig = req.body as GuiConfig
    dRoute('进入 PUT /api/default，body 参数：%O', migptConfig)
    await saveConfig(migptConfig)
    res.json({ success: true })
  })

  // 删除 .mi.json 和 .bot.json
  app.delete('/api/default', (req, res) => {
    dRoute('进入 DELETE /api/default，准备删除的路径：%s', defaultBotCwd)
    Promise.all([
      fse.remove(path.join(defaultBotCwd, '.mi.json')),
      fse.remove(path.join(defaultBotCwd, '.bot.json')),
    ]).then(
      () => {
        res.json({ success: true })
      },
      (err) => {
        res.json({ success: false, error: err })
      },
    )
  })

  // 启动 MiGPT
  app.post('/api/default/start', async (req, res) => {
    dRoute('进入 POST /api/default/start，body 参数：%O', req.body)
    const migptConfig = req.body as GuiConfig

    await saveConfig(migptConfig)

    // 如果使用了内置的 TTS 服务
    if (
      migptConfig.config.speaker.tts === 'custom' &&
      migptConfig.gui &&
      migptConfig.gui.ttsProvider !== 'custom' &&
      migptConfig.tts
    ) {
      migptConfig.env.TTS_BASE_URL = `${_trimEnd(migptConfig.gui.publicURL, '/')}${ttsSecretPath}/tts`
      dAudio(
        '检测到用户启用了内建 TTS 配置，所以修改了 TTS_BASE_URL 为：%s',
        migptConfig.env.TTS_BASE_URL,
      )
    }

    // console.log('master: 收到 /api/start', migptConfig)

    guiConfigRunning = migptConfig

    await run(migptConfig as RunConfig, defaultBotCwd)

    res.json({ success: true })
  })

  app.post('/api/default/stop', async (req, res) => {
    dRoute('进入 POST /api/default/stop')

    await stop()

    res.json({ success: true })
  })

  app.listen(port, () => {
    console.log('端口：', port)
    console.log('登录认证：', isAuth ? '已启用' : '未启用')
    console.log('秘密路径：', '已启用')
    if (options?.open) {
      open(`http://localhost:${port}`)
    }
  })
}
