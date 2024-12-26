import puppeteer from 'puppeteer'

import { animeUrlPrefix, m3u8PlayListName } from '../config/index.js'

const timeout = 300_000

export async function getM3u8URL(code) {
  const requestUrl = animeUrlPrefix + code

  const browser = await puppeteer.launch({ timeout })

  const page = await browser.newPage()

  await page.goto(requestUrl, { timeout })

  await page.waitForSelector('#playleft', { timeout })

  const targetHref = page
    .frames()
    .map(v => v.url())
    .find(v => v.includes(m3u8PlayListName))

  const m3u8Url = new URL(targetHref).searchParams.get('url')

  await browser.close()

  return m3u8Url
}
