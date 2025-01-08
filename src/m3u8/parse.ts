import { parse } from 'path'

import { Parser } from 'm3u8-parser'
import axios from 'axios'

import { m3u8PlayListName } from '#config'

/**
 * 通过url获取相关ts文件信息
 * @param url m3u8文件地址
 * @returns 解析后的文件信息
 */
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
    const tsFileName = name + '.ts'
    const tsFileUrl = prefixUrl + uri
    return Object.assign(v, { tsFileUrl, tsFileName })
  })

  return result
}
