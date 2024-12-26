import axios from 'axios'
import * as cheerio from 'cheerio'

import { animeUrlPrefix } from './config.js'

function parserMutipleNodesText($, selector, isMultiple) {
  return isMultiple
    ? Array.from($(selector)).map(v => $(v).text().trim())
    : $(selector).text()
}

export async function getAnimeInformationSet(code) {
  const bangumiUrl = [animeUrlPrefix, code].join('/')

  const { status, data } = await axios.get(bangumiUrl)

  const isSuccess = status === 200

  if (!isSuccess) {
    throw new Error(`地址${bangumiUrl}访问失败`)
  }

  const $ = cheerio.load(data)

  const options = [
    {
      name: 'title',
      selector: '.slide-info-title',
      isMultiple: false,
    },
    {
      name: 'remarks',
      selector: '.slide-info-remarks',
      isMultiple: true,
    },
    {
      name: 'introduce',
      selector: '#height_limit',
      isMultiple: false,
    },
    {
      name: 'tags',
      selector: '.vod-tag a',
      isMultiple: true,
    },
    {
      name: 'versions',
      selector: '.anthology-tab .swiper-slide',
      isMultiple: true,
    },
  ]

  const informationSet = options.reduce((t, c) => {
    const { name, selector, isMultiple } = c
    t[name] = parserMutipleNodesText($, selector, isMultiple)
    return t
  }, {})

  const { versions } = informationSet

  const anime = Array.from($('.anthology-list-box')).reduce((t, c, i) => {
    const resouce = Array.from($('a', c)).map(element => {
      const target = $(element)
      const href = target.attr('href')
      const text = target.text()
      return { href, text }
    })
    t.push({ name: versions[i], resouce })
    return t
  }, [])

  const result = Object.assign({}, informationSet, { anime })

  return result
}
