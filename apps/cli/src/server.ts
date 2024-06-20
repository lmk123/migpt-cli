import express from 'express'
// import open from 'open'
import { getStatus, type RunConfig, run, stop } from './childCtrl'

export function runServer(options?: { open?: boolean; port?: number }) {
  const port = options?.port || 36592

  const app = express()
  app.use(express.json())

  app.get('/api/status', async (req, res) => {
    res.json(getStatus())
  })

  app.post('/api/start', async (req, res) => {
    const migptConfig = req.body as RunConfig

    // console.log('master: 收到 /api/start', migptConfig)

    await run(migptConfig)

    res.json({ success: true })
  })

  app.post('/api/stop', async (req, res) => {
    // console.log('master: 收到 /api/stop')

    await stop()

    res.json({ success: true })
  })

  // todo: 确定配置页面的地址后在这里跳转过去
  // app.get('/', (req, res) => {
  //   res.redirect('http://migpt.example.com')
  // })

  app.listen(port, () => {
    if (options?.open) {
      // todo: 确定配置页面的地址后在这里跳转过去
      // open(`http://migpt.example.com`)
    }
  })
}
