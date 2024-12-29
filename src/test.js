import inquirer from 'inquirer'
import fs from 'fs-extra'
import path from 'path'

import { getAnimeInformationSet, getM3u8URL } from '#src/girigiri/index.js'
import {
  downloadTsFiles,
  useFffmpegTransform,
  parseM3u8URLFiles,
} from '#src/m3u8/index.js'
import { downloadDir } from '#src/config/index.js'

async function main() {
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
  await fs.ensureDir(currentAnimeDir)
  // 下载
  for await (const item of selectDownloadAnime) {
    const { href, text } = item
    console.log('获取m3u8文件地址中...')
    const m3u8Url = await getM3u8URL(href)
    console.log('获取成功, 等待生成缓存目录')
    const cacheDir = path.resolve(currentAnimeDir, text)
    console.log('创建缓存目录成功, 即将下载相关ts文件')
    const tsFileContent = await parseM3u8URLFiles(m3u8Url)
    await downloadTsFiles(tsFileContent, cacheDir)
    console.log('ts文件下载完毕, 准备合并转换中...')
    await useFffmpegTransform(tsFileContent, cacheDir, text)
  }
}

main()
