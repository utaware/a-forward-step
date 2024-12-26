import * as cheerio from 'cheerio'
import axios from 'axios'
import ora from 'ora'
import picocolors from 'picocolors'

import { animeUrlPrefix } from '../config/index.js'

function parserMutipleNodesText($, selector, isMultiple) {
  return isMultiple
    ? Array.from($(selector)).map(v => $(v).text().trim())
    : $(selector).text()
}

export async function getAnimeInformationSet(code) {
  const bangumiUrl = [animeUrlPrefix, code].join('/')

  const spinner = ora()

  spinner.start(`正在从地址${bangumiUrl}获取信息...`)

  const { status, data } = await axios.get(bangumiUrl)

  spinner.succeed(`信息获取完成 ${picocolors.bgBlue(bangumiUrl)}`)

  const isSuccess = status === 200

  if (!isSuccess) {
    throw new Error(`地址${bangumiUrl}访问失败`)
  }

  const $ = cheerio.load(data)

  const contentOptions = [
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

  const infos = contentOptions.reduce((t, c) => {
    const { name, selector, isMultiple } = c
    t[name] = parserMutipleNodesText($, selector, isMultiple)
    return t
  }, {})

  const { title, remarks, introduce, tags, versions } = infos

  const logOptions = [
    { desc: '动漫名称', content: title },
    { desc: '备注', content: remarks },
    { desc: '简介', content: introduce },
    { desc: '标签', content: tags },
    { desc: '剧集', content: versions },
  ]

  logOptions.forEach(({ desc, content }) => {
    const item = picocolors.green(`${desc}: ${content}`)
    console.log(item)
  })

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

  return { infos, anime }
}
