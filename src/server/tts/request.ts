import { voicePattern, languagePattern } from './pattern'
import { defaultTTSOptions } from './config'

import type { TTSConfig } from './config'

const outputFormats = new Set(['audio-16khz-32kbitrate-mono-mp3', 'audio-24khz-48kbitrate-mono-mp3', 'audio-24khz-96kbitrate-mono-mp3'])

export function getTTSConfigKeys() {
  return Object.keys(defaultTTSOptions)
}

export function assignTTSConfig(body: object): TTSConfig {
  const keys = getTTSConfigKeys() as (keyof TTSConfig)[]
  const assignConfig = keys.reduce<Partial<TTSConfig>>((acc, key) => {
    const value = Reflect.get(body, key)
    acc[key] = value
    return acc
  }, {})
  return { ...defaultTTSOptions, ...assignConfig }
}

export function parseTtsRequest(body: object): TTSConfig {
  const options: TTSConfig = assignTTSConfig(body)

  if (!options.text) throw new Error('请输入需要合成的文本')
  if (options.text.length > 3000) throw new Error('文本不能超过 3000 个字符')
  if (!voicePattern.test(options.voice)) throw new Error('音色名称格式无效')
  if (!languagePattern.test(options.lang)) throw new Error('语言代码格式无效')
  if (!outputFormats.has(options.outputFormat)) throw new Error('输出格式不受支持')
  if (!Number.isInteger(options.timeout) || options.timeout < 3000 || options.timeout > 60000) {
    throw new Error('超时时间必须是 3000 到 60000 毫秒之间的整数')
  }

  return options
}
