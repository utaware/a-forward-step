import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import serve from 'koa-static'

import { publicDir } from '#config'
import { createRouter } from './router'

export function createApp() {
  const app = new Koa()
  const router = createRouter()

  app.use(async (ctx, next) => {
    try {
      await next()
    } catch (error) {
      ctx.status = 400
      ctx.body = { error: error instanceof Error ? error.message : '语音生成失败' }
    }
  })
  app.use(bodyParser({ jsonLimit: '32kb' }))
  app.use(serve(publicDir))
  app.use(router.routes())
  app.use(router.allowedMethods())

  return app
}
