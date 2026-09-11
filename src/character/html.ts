import axios from 'axios'
import { load } from 'cheerio'

import { getRoleVoiceUrl } from './url'

import { print } from '#utils'

export interface IRoleVoiceItem {
  language: string
  category: string
  description: string
  downloadUrl: string
}

// 获取角色在维基百科上的语音页面 HTML
export async function getRoleVoiceHtml(name: string) {
  const { status, data, statusText } = await axios.get(getRoleVoiceUrl(name))
  const isSuccess = status === 200
  if (!isSuccess) {
    print(`Failed to fetch role voice HTML for ${name}: ${status} ${statusText}`, 'error')
    throw new Error(`Failed to fetch role voice HTML for ${name}`)
  }
  return data
}

// 解析角色在维基百科上的语音页面 HTML
export async function parseRoleVoiceHtml(html: string) {
  const $ = load(html)
  const containerEL = $('#mw-content-text')
  const tableEL = containerEL.find('.tabbertab')
  const voiceList: IRoleVoiceItem[] = []

  tableEL.toArray().forEach(el => {
    const language = el.attribs['title'].trim() || ''
    const tableEl = $(el).find('table.wikitable')
    let lastType = ''

    tableEl.find('tr').each((_, tr) => {
      const tds = $(tr).find('td')
      if (tds.length < 3) return

      let category = ''
      let description = ''
      let downloadUrl = ''

      if (tds.length >= 4) {
        category = $(tds[0]).text().trim()
        lastType = category
        description = $(tds[1]).text().trim()
        downloadUrl = $(tds[3]).find('a').attr('href') || ''
      } else if (tds.length === 3) {
        category = lastType
        description = $(tds[0]).text().trim()
        downloadUrl = $(tds[2]).find('a').attr('href') || ''
      }

      voiceList.push({
        language,
        category,
        description,
        downloadUrl,
      })
    })
  })

  return voiceList
}

// 获取角色在维基百科上的语音数据
export async function useRoleVoiceData(name: string) {
  const html = await getRoleVoiceHtml(name)
  const voiceData = await parseRoleVoiceHtml(html)
  return voiceData
}
