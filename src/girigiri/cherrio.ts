import * as cheerio from 'cheerio'

import type { IAnimeVersion } from '#types'

export type TSingleInfoKeys = 'title' | 'introduce'
export type TMutipleInfoKeys = 'remarks' | 'tags' | 'versions'

interface ICherrioSingleNodeMap {
  title: string
  introduce: string
}

interface ICheerioMutipleNodeMap {
  remarks: string[]
  tags: string[]
  versions: string[]
}

const cheerioSingleNodeOption: {
  name: TSingleInfoKeys
  selector: string
  format?: (content: string) => string
}[] = [
  {
    name: 'title',
    selector: '.slide-info-title',
    format: (content) => content.replace(/\s/g, '-')
  },
  {
    name: 'introduce',
    selector: '#height_limit',
  },
]

const cheerioMutipleNodeOption: {
  name: TMutipleInfoKeys
  selector: string
}[] = [
  {
    name: 'remarks',
    selector: '.slide-info-remarks',
  },
  {
    name: 'tags',
    selector: '.vod-tag a',
  },
  {
    name: 'versions',
    selector: '.anthology-tab .swiper-slide',
  },
]

export function getSingleNodeInfo($: cheerio.Root) {
  return cheerioSingleNodeOption.reduce((t, c) => {
    const { name, selector, format } = c
    const content = $(selector).text()
    t[name] = format ? format(content) : content
    return t
  }, {} as ICherrioSingleNodeMap)
}

export function getMutipleNodeInfo($: cheerio.Root) {
  return cheerioMutipleNodeOption.reduce((t, c) => {
    const { name, selector } = c
    t[name] = Array.from($(selector)).map(v => $(v).text().trim())
    return t
  }, {} as ICheerioMutipleNodeMap)
}

export function getAnimeSrouce($: cheerio.Root, versions: string[]) {
  return Array.from($('.anthology-list-box')).reduce((t, c, i) => {
    const resouce = Array.from($('a', c)).map(element => {
      const target = $(element)
      const href = target.attr('href') || ''
      const text = target.text()
      return { href, text }
    })
    t.push({ name: versions[i], resouce })
    return t
  }, [] as IAnimeVersion[])
}

export function getPageInfoAndSource(data: string) {
  const $ = cheerio.load(data)
  const mutipleNodes = getMutipleNodeInfo($)
  const singleNodes = getSingleNodeInfo($)
  const { versions } = mutipleNodes
  const anime = getAnimeSrouce($, versions)
  return { anime, ...singleNodes, ...mutipleNodes }
}

