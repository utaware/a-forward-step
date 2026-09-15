import { mkdir } from 'node:fs/promises'

import getPort, { portNumbers } from 'get-port'

import { audioDir, port } from '#config'
import { clearAssetsDir } from '#utils'
import { createApp } from './app'

async function start() {
  await mkdir(audioDir, { recursive: true })

  const app = createApp()
  const activePort = await getPort({ port: portNumbers(port, port + 1) })
  app.listen(activePort, () => {
    console.log(`Server is listening on port ${activePort}`)
  })

  process.once('SIGINT', () => clearAssetsDir())
  process.once('SIGTERM', () => clearAssetsDir())
}

start().catch(error => {
  console.error(error)
  process.exitCode = 1
})
