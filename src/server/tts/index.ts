import { randomUUID } from 'node:crypto'
import { join } from 'node:path'

import { EdgeTTS } from 'node-edge-tts'

import { audioDir } from '#config'
import { parseTtsRequest } from './request'

export async function generateSpeech(body: unknown) {
  const filename = `${randomUUID()}.mp3`
  const outputPath = join(audioDir, filename)
  const options = parseTtsRequest(body)
  const tts = new EdgeTTS(options)

  await tts.ttsPromise(options.text, outputPath)
  return filename
}
