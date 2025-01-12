import puppeteer from 'puppeteer'
import ora from 'ora'

import { animeUrlPrefix, m3u8PlayListName } from '#config'
import { getM3u8URLCacheStore, writeM3u8URLCacheStore } from './cache'

const timeout = 300_000

export async function getAnimeM3u8URL(code: string) {

  const m3u8Store = await getM3u8URLCacheStore()

  const hasCodeCache = m3u8Store.has(code)

  const m3u8URLResult = hasCodeCache
    ? m3u8Store.get(code) as string
    : await getM3u8URLWithPuppeteer(code)

  if (!hasCodeCache) {
    m3u8Store.set(code, m3u8URLResult)
    await writeM3u8URLCacheStore(m3u8Store)
  }

  return m3u8URLResult

}

/**
 * 通过gvcode获取对应动漫的m3u8文件地址
 * @param code gvcode
 * @returns playlist.m3u8 - url
 */
export async function getM3u8URLWithPuppeteer(code: string) {

  const spinner = ora()

  spinner.start('通过puppeteer获取m3u8文件地址')

  const requestUrl = animeUrlPrefix + code

  const browser = await puppeteer.launch({ timeout })

  const page = await browser.newPage()

  await page.goto(requestUrl, { timeout })

  await page.waitForSelector('#playleft', { timeout })

  const targetHref = page
    .frames()
    .map(v => v.url())
    .find(v => v.includes(m3u8PlayListName))

  if (!targetHref) {
    throw new Error('获取m3u8文件地址失败')
  }

  const m3u8Url = new URL(targetHref).searchParams.get('url')

  if (!m3u8Url) {
    throw new Error('m3u8地址不存在')
  }

  await browser.close()

  spinner.succeed('获取m3u8文件地址成功')

  return m3u8Url
}
