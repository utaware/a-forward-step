import { parse } from 'node:path'

import { Parser } from 'm3u8-parser'
import axios from 'axios'

import { m3u8PlayListName } from '#config'

export async function parseM3u8URLFiles(url: string) {
  const m3u8Parse = new Parser()

  const { status, data } = await axios.get(url)

  const isSuccess = status === 200

  if (!isSuccess) {
    throw new Error(`获取m3u8文件内容出错, 错误码${status}`)
  }

  m3u8Parse.push(data)
  m3u8Parse.end()

  const {
    manifest: { segments },
  } = m3u8Parse

  const prefixUrl = url.replace(m3u8PlayListName, '')

  const result = segments.map(v => {
    const { uri } = v
    const { name } = parse(uri)
    const realuri = name + '.js'
    const tsUrl = prefixUrl + uri
    return Object.assign(v, { tsUrl, uri, realuri })
  })

  return result
}
