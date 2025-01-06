import axios from 'axios'
import ora from 'ora'
import * as picocolors from 'picocolors'

import { animeUrlPrefix } from '@/config/index.ts'
import { getPageInfoAndSource } from './cherrio.ts'
import { printCurrentAnimeInfos } from './print.ts'

/**
 * 通过gvcode获取对应页面相关信息
 * @param code 动漫对应gvcode
 * @returns 相关信息
 */
export async function getAnimeInformationSet(code: string) {
  const bangumiUrl = [animeUrlPrefix, code].join('/')

  const spinner = ora()

  spinner.start(`正在从地址${bangumiUrl}获取信息...`)

  const { status, data } = await axios.get(bangumiUrl)

  spinner.succeed(`信息获取完成 ${picocolors.bgBlue(bangumiUrl)}`)

  const isSuccess = status === 200

  if (!isSuccess) {
    throw new Error(`地址${bangumiUrl}访问失败`)
  }

  const content = getPageInfoAndSource(data)

  printCurrentAnimeInfos(content)

  return content
}
