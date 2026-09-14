import { randomUUID } from 'node:crypto'
import { join } from 'node:path'

import { EdgeTTS } from 'node-edge-tts'

import { audioDir } from '#config'
import { parseTtsRequest } from './request'
import type { TTSConfig } from './config'

export async function generateSpeech(body: object) {
  const filename = `${randomUUID()}.mp3`
  const outputPath = join(audioDir, filename)
  const options = parseTtsRequest(body)
  const tts = new EdgeTTS({
    voice: options.voice,
    lang: options.lang,
    outputFormat: options.outputFormat,
    rate: options.rate,
    pitch: options.pitch,
    volume: options.volume,
    timeout: options.timeout,
  })

  await tts.ttsPromise(options.text, outputPath)
  return filename
}
