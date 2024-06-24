import * as path from 'node:path'
import express from 'express'
import open from 'open'
import * as os from 'node:os'
import { getStatus, type RunConfig, run, stop } from '@migptgui/controller'
import fse from 'fs-extra'

export function runServer(options?: {
  open?: boolean
  port?: number
  staticPath?: string
}) {
  const port = options?.port || 36592

  const app = express()
  app.use(express.json())

  if (options?.staticPath) {
    app.use(express.static(options.staticPath))
  }

  app.get('/api/status', async (req, res) => {
    res.json(getStatus())
  })

  app.post('/api/start', async (req, res) => {
    const migptConfig = req.body as RunConfig

    // console.log('master: 收到 /api/start', migptConfig)

    const cwd = path.join(os.tmpdir(), '.migpt/default/')
    await fse.ensureDir(cwd)
    await run(migptConfig, cwd)

    res.json({ success: true })
  })

  app.post('/api/stop', async (req, res) => {
    // console.log('master: 收到 /api/stop')

    await stop()

    res.json({ success: true })
  })

  app.listen(port, () => {
    if (options?.open) {
      open(`http://localhost:${port}`)
    }
  })
}