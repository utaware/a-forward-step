import { getAnimeInformationSet } from './girigiri/index.js'

import inquirer from 'inquirer'

async function main() {
  // 获取动漫对应gvCode
  const { gvCode } = await inquirer.prompt({
    type: 'input',
    name: 'gvCode',
    default: 'GV26241',
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

  console.log({ selectDownloadAnime })
}

main()
