import { randomUUID } from 'node:crypto'
import { join } from 'node:path'

import { EdgeTTS } from 'node-edge-tts'

import { audioDir } from '#config'
import type { TtsOptions } from './request'

export async function generateSpeech(options: TtsOptions) {
  const filename = `${randomUUID()}.mp3`
  const outputPath = join(audioDir, filename)
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
