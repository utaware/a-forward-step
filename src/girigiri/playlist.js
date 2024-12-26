import { animeUrlPrefix, m3u8PlayListName } from './config.js'

export async function getM3u8URL(code) {
  const requestUrl = [animeUrlPrefix, code].join('/')

  const browser = await puppeteer.launch()

  const page = await browser.newPage()

  await page.goto(requestUrl)

  await page.waitForSelector('#playleft')

  const targetHref = page
    .frames()
    .map(v => v.url())
    .find(v => v.includes(m3u8PlayListName))

  const m3u8Url = new URL(targetHref).searchParams.get('url')

  await browser.close()

  return m3u8Url
}
