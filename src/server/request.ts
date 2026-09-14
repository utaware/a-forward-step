export interface TtsOptions {
  text: string
  voice: string
  lang: string
  outputFormat: string
  rate: string
  pitch: string
  volume: string
  timeout: number
}

interface TtsRequest {
  text?: unknown
  voice?: unknown
  lang?: unknown
  outputFormat?: unknown
  rate?: unknown
  pitch?: unknown
  volume?: unknown
  timeout?: unknown
}

const percentPattern = /^(default|[+-]\d{1,3}%)$/
const voicePattern = /^[a-z]{2,3}-[A-Z]{2}-[A-Za-z0-9]+Neural$/
const languagePattern = /^[a-z]{2,3}-[A-Z]{2}$/
const outputFormats = new Set(['audio-16khz-32kbitrate-mono-mp3', 'audio-24khz-48kbitrate-mono-mp3', 'audio-24khz-96kbitrate-mono-mp3'])

function readString(value: unknown, fallback: string) {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback
}

function readPercent(value: unknown, fallback: string) {
  const result = readString(value, fallback)
  if (!percentPattern.test(result)) throw new Error(`无效的语音参数: ${result}`)
  return result
}

export function parseTtsRequest(input: unknown): TtsOptions {
  const body = (input ?? {}) as TtsRequest
  const options: TtsOptions = {
    text: readString(body.text, ''),
    voice: readString(body.voice, 'zh-CN-XiaoxiaoNeural'),
    lang: readString(body.lang, 'zh-CN'),
    outputFormat: readString(body.outputFormat, 'audio-24khz-48kbitrate-mono-mp3'),
    rate: readPercent(body.rate, 'default'),
    pitch: readPercent(body.pitch, 'default'),
    volume: readPercent(body.volume, 'default'),
    timeout: Number(body.timeout ?? 15000),
  }

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
