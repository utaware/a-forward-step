import { load } from 'cheerio'

import { request } from '#utils'
// 获取小说章节的 URL
export function getNovelUrl(chapter: number) {
  return `https://www.888gp.net/9t2c/${chapter}.html`
}

// 获取小说章节的 HTML 内容
export async function getNovelHtmlContent(chapter: number) {
  const { data, status, statusText } = await request.get(getNovelUrl(chapter))
  const isSuccess = status === 200
  if (!isSuccess) {
    throw new Error(`Failed to fetch novel content: ${status} ${statusText}`)
  }
  return data
}

// 获取小说章节的文本内容
export async function getNovelTextContent(chapter: number) {
  const htmlContent = await getNovelHtmlContent(chapter)
  const $ = load(htmlContent)
  const textEL = $('#tts-content')
  // 这里可以使用正则或其他方法从 HTML 中提取文本内容
  const textContent = textEL.text()
  return textContent
}
