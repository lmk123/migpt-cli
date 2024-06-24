import { runServer } from '@migptgui/server'
import path from 'node:path'

runServer({
  staticPath: path.join(__dirname, './web/'),
})
