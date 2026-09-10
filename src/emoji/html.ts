import axios from 'axios'
import fs from 'fs-extra'
import { load } from 'cheerio'

import { dataDirPath, dataEmojiPath } from '#config'
import { print, jsonStringifyFormat } from '#utils'

const baseUrl = 'https://wiki.biligame.com'
const emojiUrl = `${baseUrl}/starengine/index.php?title=分类:文件/表情&fileuntil=UT+Item+Emoji+113+08.png#mw-category-media`

export interface IEmojiDataItem {
  imgSrc: string
  imgAlt: string
}

export async function requestEmojiHtml(url: string) {
  const { status, data, statusText } = await axios.get(url)
  const isSuccess = status === 200
  if (isSuccess) {
    return data
  } else {
    print(statusText, 'error')
    return ''
  }
}

export async function requestEmojiData(url: string) {
  const emojiHtml = await requestEmojiHtml(url)
  const $ = load(emojiHtml)
  const containerEl = $('#mw-category-media')
  const emojiListEl = containerEl.find('.mw-gallery-traditional li')
  const pageLinkEls = containerEl.find('a')
  const nextPageEl = pageLinkEls.filter((_, el) => $(el).text() === '下一页')
  const nextPageUrl = nextPageEl.attr('href') ? `${baseUrl}${nextPageEl.attr('href')}` : ''
  const emojiData = emojiListEl.toArray().map(element => {
    const imgEl = $(element).find('img')
    const imgSrcset = imgEl.attr('srcset') || ''
    const [imgSrc] = imgSrcset.split(' ')
    const imgAlt = imgEl.attr('alt') || ''
    return { imgSrc, imgAlt }
  })
  return { emojiData, nextPageUrl }
}

export async function requestAllEmojiData() {
  let currentPageUrl = emojiUrl
  let hasNextPage = true
  let allEmojiData: IEmojiDataItem[] = []

  while (hasNextPage) {
    const { emojiData, nextPageUrl } = await requestEmojiData(currentPageUrl)
    allEmojiData = [...allEmojiData, ...emojiData]
    if (nextPageUrl) {
      currentPageUrl = nextPageUrl
    } else {
      hasNextPage = false
    }
  }
  return allEmojiData
}

export async function saveEmojiDataToJsonFile(data: IEmojiDataItem[]) {
  await fs.ensureDir(dataDirPath)
  const jsonData = jsonStringifyFormat(data)
  await fs.writeFile(dataEmojiPath, jsonData, 'utf-8')
}

export async function getEmojiData(): Promise<IEmojiDataItem[]> {
  const hasCache = await fs.pathExists(dataEmojiPath)
  if (hasCache) {
    const jsonData = await fs.readFile(dataEmojiPath, 'utf-8')
    return JSON.parse(jsonData)
  } else {
    const emojiData = await requestAllEmojiData()
    await saveEmojiDataToJsonFile(emojiData)
    return emojiData
  }
}
