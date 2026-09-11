import axios from 'axios'
import { load } from 'cheerio'

import { getRoleGalleryUrl } from './url'

import { print } from '#utils'

export interface IRoleGalleryItem {
  category: string
  subCategory?: string
  title: string
  downloadUrl: string
}

/**
 * 从页面 HTML 的脚本中匹配过滤动画类型数组 (AnimTypeArr)
 */
function parseAnimTypeArrFromHtml($: ReturnType<typeof load>): [string, string][] {
  let scriptContent = ''
  $('script').each((_, s) => {
    scriptContent += $(s).html() + '\n'
  })

  const animTypeArr: [string, string][] = []
  const match = scriptContent.match(/(?:const|let|var)\s+AnimTypeArr\s*=\s*(\[[\s\S]*?\]);/)
  if (match) {
    const entryRegex = /\[\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]\s*\]/g
    let entryMatch: RegExpExecArray | null
    while ((entryMatch = entryRegex.exec(match[1])) !== null) {
      animTypeArr.push([entryMatch[1], entryMatch[2]])
    }
  }

  return animTypeArr
}

/**
 * 将维基缩略图 URL 转换为原图 URL
 */
function getOriginalImageUrl(thumbUrl: string): string {
  if (!thumbUrl) return ''
  return thumbUrl.replace(/\/thumb\/([^\/]+\/[^\/]+\/[^\/]+)\/.*$/, '/$1')
}

/**
 * 获取角色在维基百科上的画廊页面 HTML
 */
export async function getRoleGalleryHtml(name: string) {
  const { status, data, statusText } = await axios.get(getRoleGalleryUrl(name))
  const isSuccess = status === 200
  if (!isSuccess) {
    print(`Failed to fetch role gallery HTML for ${name}: ${status} ${statusText}`, 'error')
    throw new Error(`Failed to fetch role gallery HTML for ${name}`)
  }
  return data
}

/**
 * 解析角色画廊 HTML 页面中的“表情”和“其他”部分
 */
function parseStandardGallerySection($: ReturnType<typeof load>, container: ReturnType<ReturnType<typeof load>>, headlineName: string): IRoleGalleryItem[] {
  const items: IRoleGalleryItem[] = []
  const headlineSpan = container.find('.mw-headline').filter((_, el) => $(el).text().trim() === headlineName)

  if (!headlineSpan.length) return items

  const parentHeading = headlineSpan.closest('h2, h3, h4')
  const nodes = parentHeading.nextUntil('h2, h3')

  let boxes = nodes.find('.gallerybox')
  if (!boxes.length) {
    boxes = nodes.find('li')
  }

  boxes.each((_, box) => {
    const img = $(box).find('img').first()
    if (!img.length) return

    const rawSrc = img.attr('src') || img.attr('data-src') || ''
    const downloadUrl = getOriginalImageUrl(rawSrc)

    let title = $(box).find('.gallerytext p').first().text().trim() || $(box).find('.gallerytext').text().trim() || img.attr('alt')?.trim() || ''

    title = title.replace(/\s+/g, ' ')
    if (downloadUrl && title) {
      items.push({
        category: headlineName,
        title,
        downloadUrl,
      })
    }
  })

  return items
}

/**
 * 解析角色画廊 HTML 页面中的“皮肤”部分
 */
function parseSkinSection($: ReturnType<typeof load>, container: ReturnType<ReturnType<typeof load>>): IRoleGalleryItem[] {
  const items: IRoleGalleryItem[] = []
  const headlineSpan = container.find('.mw-headline').filter((_, el) => $(el).text().trim() === '皮肤')

  if (!headlineSpan.length) return items

  const skinHeading = headlineSpan.closest('h2, h3, h4')
  const nodes = skinHeading.nextUntil('h2, h3')

  let currentSubCategory = '默认'

  nodes.each((_, node) => {
    const subHeadline = $(node).find('.mw-headline').text().trim()
    if (subHeadline) {
      currentSubCategory = subHeadline
    }

    let boxes = $(node).find('.gallerybox')
    if (!boxes.length && $(node).find('img').length) {
      boxes = $(node).find('.thumb, div > div, .resp-tab-content > div, li')
      if (!boxes.length) {
        boxes = $(node)
      }
    }

    boxes.each((idx, box) => {
      const img = $(box).find('img').first()
      if (!img.length) return

      const rawSrc = img.attr('src') || img.attr('data-src') || ''
      const downloadUrl = getOriginalImageUrl(rawSrc)

      let title = $(box).find('.gallerytext p').first().text().trim() || $(box).find('.gallerytext').text().trim() || img.attr('alt')?.trim() || ''

      title = title.replace(/\s+/g, ' ')
      if (!title || title === currentSubCategory) {
        title = `${currentSubCategory}_${idx + 1}`
      }

      if (downloadUrl) {
        items.push({
          category: '皮肤',
          subCategory: currentSubCategory,
          title,
          downloadUrl,
        })
      }
    })
  })

  return items
}

/**
 * 通过 MediaWiki API 批量查询行为动画 GIF URL
 */
async function fetchAnimationGifsBatch(
  queryList: { characterId: string; skinName: string; animCode: string; animName: string }[]
): Promise<IRoleGalleryItem[]> {
  const items: IRoleGalleryItem[] = []
  if (!queryList.length) return items

  const chunkSize = 50
  for (let i = 0; i < queryList.length; i += chunkSize) {
    const chunk = queryList.slice(i, i + chunkSize)
    const titlesParam = chunk.map(item => `File:${encodeURIComponent(`${item.animCode}_${item.characterId}.gif`)}`).join('|')

    const apiURL = `https://wiki.biligame.com/starengine/api.php` + `?action=query&titles=${titlesParam}&prop=imageinfo&iiprop=url&format=json`

    try {
      const { data } = await axios.get(apiURL)
      const pages = data?.query?.pages || {}

      for (const pageId in pages) {
        const page = pages[pageId]
        if (page.imageinfo && page.imageinfo[0]?.url) {
          const rawTitle = page.title || ''
          const titleFileName = rawTitle
            .replace(/^(文件|File):/i, '')
            .trim()
            .replace(/\s+/g, '_')

          const found = chunk.find(c => `${c.animCode}_${c.characterId}.gif`.toLowerCase() === titleFileName.toLowerCase())

          if (found) {
            items.push({
              category: '行为动画',
              subCategory: found.skinName,
              title: found.animName,
              downloadUrl: page.imageinfo[0].url,
            })
          }
        }
      }
    } catch (error) {
      print(`Failed to fetch animation gifs batch: ${(error as Error).message}`, 'error')
    }
  }

  return items
}

/**
 * 解析角色画廊 HTML 页面中的“行为动画”部分
 */
async function parseAnimationSection($: ReturnType<typeof load>, container: ReturnType<ReturnType<typeof load>>): Promise<IRoleGalleryItem[]> {
  const headlineSpan = container.find('.mw-headline').filter((_, el) => $(el).text().trim() === '行为动画')

  if (!headlineSpan.length) return []

  const animHeading = headlineSpan.closest('h2, h3, h4')
  const nodes = animHeading.nextUntil('h2, h3')

  // 1. 提取皮肤编号列表（例如 textarea 中: 101,默认 \n 101_Max,羁绊皮肤 ...）
  const skinList: [string, string][] = []
  const textareaEl = nodes.filter('textarea').add(nodes.find('textarea'))
  const textareaText = textareaEl.text().trim()

  if (textareaText) {
    textareaText.split('\n').forEach(line => {
      const parts = line.split(',').map(s => s.trim())
      if (parts.length >= 2 && parts[0]) {
        skinList.push([parts[0], parts[1]])
      }
    })
  }

  // 2. 从 HTML 页面脚本中匹配过滤动画类型数组 AnimTypeArr
  const animTypeArr = parseAnimTypeArrFromHtml($)

  // 3. 构建需要 API 校验的文件列表
  const queryList: {
    characterId: string
    skinName: string
    animCode: string
    animName: string
  }[] = []

  for (const [charId, skinName] of skinList) {
    for (const [animCode, animName] of animTypeArr) {
      queryList.push({
        characterId: charId,
        skinName,
        animCode,
        animName,
      })
    }
  }

  return await fetchAnimationGifsBatch(queryList)
}

/**
 * 解析角色在维基百科上的画廊页面 HTML
 */
export async function parseRoleGalleryHtml(html: string): Promise<IRoleGalleryItem[]> {
  const $ = load(html)
  const container = $('#mw-content-text .mw-parser-output')

  const emojiItems = parseStandardGallerySection($, container, '表情')
  const skinItems = parseSkinSection($, container)
  const otherItems = parseStandardGallerySection($, container, '其他')
  const animItems = await parseAnimationSection($, container)

  return [...emojiItems, ...skinItems, ...otherItems, ...animItems]
}

/**
 * 获取角色在维基百科上的画廊数据
 */
export async function useRoleGalleryData(name: string): Promise<IRoleGalleryItem[]> {
  const html = await getRoleGalleryHtml(name)
  return await parseRoleGalleryHtml(html)
}
