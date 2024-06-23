import * as path from 'node:path'
import express from 'express'
import open from 'open'
import { getStatus, type RunConfig, run, stop } from './childCtrl'

export function runServer(options?: { open?: boolean; port?: number }) {
  const port = options?.port || 36592
  const isAutoOpen = options?.open == null ? true : options.open

  const app = express()
  app.use(express.json())

  app.use(express.static(path.join(__dirname, './web')))

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

  app.listen(port, () => {
    if (isAutoOpen) {
      open(`http://localhost:${port}`)
    }
  })
}
