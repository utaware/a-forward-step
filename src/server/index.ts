import { mkdir } from 'node:fs/promises'

import { audioDir, port } from '#config'
import { clearAssetsDir } from '#utils'
import { createApp } from './app'

async function start() {
  await mkdir(audioDir, { recursive: true })

  const app = createApp()
  app.listen(port, () => {
    console.log(`TTS debugger: http://localhost:${port}`)
  })

  app.once('close', async () => {
    await clearAssetsDir()
  })
}

start().catch(error => {
  console.error(error)
  process.exitCode = 1
})
