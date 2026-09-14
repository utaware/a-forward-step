import { mkdir } from 'node:fs/promises'

import { audioDir, port } from '#config'
import { createApp } from './app'

async function start() {
  await mkdir(audioDir, { recursive: true })

  const app = createApp()
  app.listen(port, () => {
    console.log(`TTS debugger: http://localhost:${port}`)
  })
}

start().catch(error => {
  console.error(error)
  process.exitCode = 1
})
