import { createReadStream } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { basename, join } from 'node:path'

import Router from '@koa/router'

import { audioDir, rootDir } from '#config'
import { parseTtsRequest } from './request'
import { generateSpeech } from './tts'

export function createRouter() {
  const router = new Router()

  router.get('/', async ctx => {
    ctx.type = 'html'
    ctx.body = await readFile(join(rootDir, 'index.html'), 'utf8')
  })

  router.post('/api/tts', async ctx => {
    const options = parseTtsRequest(ctx.request.body)
    const filename = await generateSpeech(options)
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

  return router
}
