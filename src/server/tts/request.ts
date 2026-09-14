import Joi from 'joi'

import { languagePattern, percentPattern, voicePattern } from './pattern'
import { defaultTTSOptions } from './config'

import type { TTSConfig } from './config'

const outputFormats = ['audio-16khz-32kbitrate-mono-mp3', 'audio-24khz-48kbitrate-mono-mp3', 'audio-24khz-96kbitrate-mono-mp3']

const ttsRequestSchema = Joi.object<TTSConfig>({
  text: Joi.string().trim().max(3000).default(defaultTTSOptions.text).messages({
    'string.empty': '请输入需要合成的文本',
    'string.max': '文本不能超过 3000 个字符',
  }),
  voice: Joi.string().trim().pattern(voicePattern).default(defaultTTSOptions.voice).messages({
    'string.pattern.base': '音色名称格式无效',
  }),
  lang: Joi.string().trim().pattern(languagePattern).default(defaultTTSOptions.lang).messages({
    'string.pattern.base': '语言代码格式无效',
  }),
  outputFormat: Joi.string()
    .valid(...outputFormats)
    .default(defaultTTSOptions.outputFormat)
    .messages({
      'any.only': '输出格式不受支持',
    }),
  rate: Joi.string().pattern(percentPattern).default(defaultTTSOptions.rate),
  pitch: Joi.string().pattern(percentPattern).default(defaultTTSOptions.pitch),
  volume: Joi.string().pattern(percentPattern).default(defaultTTSOptions.volume),
  timeout: Joi.number().integer().min(3000).max(60000).default(defaultTTSOptions.timeout).messages({
    'number.base': '超时时间必须是数字',
    'number.integer': '超时时间必须是整数',
    'number.min': '超时时间不能小于 3000 毫秒',
    'number.max': '超时时间不能大于 60000 毫秒',
  }),
})

export function parseTtsRequest(body: unknown): TTSConfig {
  const { error, value } = ttsRequestSchema.validate(body, {
    abortEarly: false,
    stripUnknown: true,
  })

  if (error) {
    throw new Error(error.details.map(detail => detail.message).join('；'))
  }

  return value
}
