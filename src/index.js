import inquirer from 'inquirer'
import fs from 'fs-extra'
import path from 'path'
import picocolors from 'picocolors'

import { getAnimeInformationSet, getM3u8URL } from '#girigiri'
import {
  downloadTsFiles,
  transformAndClearMedia,
  parseM3u8URLFiles,
} from '#m3u8'
import { downloadDir } from '#config'

async function main() {
  console.time('任务用时')
  // 获取动漫对应gvCode
  const { gvCode } = await inquirer.prompt({
    type: 'input',
    name: 'gvCode',
    default: 'GV922',
    message: '请输入动画GV编码',
  })
  // 获取动漫相关信息
  const {
    anime,
    infos: { title },
  } = await getAnimeInformationSet(gvCode)
  // 存在不同版本时 筛选下载的番剧资源分类
  const animeInquirerVersionChoices = anime.map((v, i) => {
    const { name } = v
    return { name, value: i }
  })

  const { selectedAnimeVersion } = await inquirer.prompt({
    type: 'list',
    name: 'selectedAnimeVersion',
    message: '请选择下载分类',
    choices: animeInquirerVersionChoices,
  })
  // 确定分类 可选式剧集下载
  const { resouce } = anime[selectedAnimeVersion]

  const animeInquirerPVChoices = resouce.map((v, i) => {
    const { text } = v
    return { name: `${title} ${text}`, value: i }
  })

  const { selectedAnimePVIndex } = await inquirer.prompt({
    type: 'checkbox',
    name: 'selectedAnimePVIndex',
    message: '请选择下载剧集',
    choices: animeInquirerPVChoices,
  })

  const selectDownloadAnime = resouce.filter((_, i) => {
    return selectedAnimePVIndex.includes(i)
  })
  // 清理存储
  const currentAnimeDir = path.resolve(downloadDir, title)
  console.log(`当前缓存路径: ${picocolors.bgBlue(currentAnimeDir)}`)
  await fs.ensureDir(currentAnimeDir)
  await fs.emptyDir(currentAnimeDir)
  // 下载
  for await (const item of selectDownloadAnime) {
    const { href, text } = item

    const m3u8Url = await getM3u8URL(href)
    console.log(`m3u8文件地址: ${picocolors.bgBlue(m3u8Url)}`)
    const cacheDir = path.resolve(currentAnimeDir, text)
    const tsFileContent = await parseM3u8URLFiles(m3u8Url)
    await downloadTsFiles(tsFileContent, cacheDir)
    await transformAndClearMedia(tsFileContent, cacheDir, text)
  }

  console.timeEnd('任务用时')
}

main()
