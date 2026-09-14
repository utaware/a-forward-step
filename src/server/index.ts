import { createReadStream } from 'node:fs'
import { mkdir, readFile } from 'node:fs/promises'
import { basename, join } from 'node:path'
import { randomUUID } from 'node:crypto'

import Router from '@koa/router'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import { EdgeTTS } from 'node-edge-tts'

import { port, rootDir, audioDir } from '#config'

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

async function start() {
  await mkdir(audioDir, { recursive: true })

  const app = new Koa()
  const router = new Router()

  app.use(async (ctx, next) => {
    try {
      await next()
    } catch (error) {
      ctx.status = 400
      ctx.body = { error: error instanceof Error ? error.message : '语音生成失败' }
    }
  })
  app.use(bodyParser({ jsonLimit: '32kb' }))

  router.get('/', async ctx => {
    ctx.type = 'html'
    ctx.body = await readFile(join(rootDir, 'index.html'), 'utf8')
  })

  router.post('/api/tts', async ctx => {
    const body = ctx.request.body as TtsRequest
    const text = readString(body.text, '')
    const voice = readString(body.voice, 'zh-CN-XiaoxiaoNeural')
    const lang = readString(body.lang, 'zh-CN')
    const outputFormat = readString(body.outputFormat, 'audio-24khz-48kbitrate-mono-mp3')
    const rate = readPercent(body.rate, 'default')
    const pitch = readPercent(body.pitch, 'default')
    const volume = readPercent(body.volume, 'default')
    const timeout = Number(body.timeout ?? 15000)

    if (!text) throw new Error('请输入需要合成的文本')
    if (text.length > 3000) throw new Error('文本不能超过 3000 个字符')
    if (!voicePattern.test(voice)) throw new Error('音色名称格式无效')
    if (!languagePattern.test(lang)) throw new Error('语言代码格式无效')
    if (!outputFormats.has(outputFormat)) throw new Error('输出格式不受支持')
    if (!Number.isInteger(timeout) || timeout < 3000 || timeout > 60000) {
      throw new Error('超时时间必须是 3000 到 60000 毫秒之间的整数')
    }

    const filename = `${randomUUID()}.mp3`
    const outputPath = join(audioDir, filename)
    const tts = new EdgeTTS({
      voice,
      lang,
      outputFormat,
      rate,
      pitch,
      volume,
      timeout,
    })

    await tts.ttsPromise(text, outputPath)
    ctx.body = { audioUrl: `/audio/${filename}` }
  })

  router.get('/audio/:filename', ctx => {
    const filename = basename(ctx.params.filename)
    if (!/^[0-9a-f-]{36}\.mp3$/i.test(filename)) {
      ctx.throw(404)
    }

    ctx.type = 'audio/mpeg'
    ctx.body = createReadStream(join(audioDir, filename))
  })

  app.use(router.routes())
  app.use(router.allowedMethods())
  app.listen(port, () => {
    console.log(`TTS debugger: http://localhost:${port}`)
  })
}

start().catch(error => {
  console.error(error)
  process.exitCode = 1
})
