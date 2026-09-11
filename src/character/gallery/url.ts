import { dataDirPath } from '#config'

import { ECharacterAssets, getWikiRoleUrl, getCharacterAssetsDir } from '../url'

// 获取角色在维基百科上的画廊页面 URL
export function getRoleGalleryUrl(name: string) {
  return `${getWikiRoleUrl(name)}/${ECharacterAssets['gallery']}`
}

// 获取角色画廊数据的本地存储目录
export function getRoleGalleryDataDir(name: string) {
  return `${dataDirPath}/${name}`
}

// 获取角色画廊数据的本地存储路径
export function getRoleGalleryDataPath(name: string) {
  return `${getRoleGalleryDataDir(name)}/${ECharacterAssets.画廊}.json`
}

// 获取角色画廊资源的本地存储路径
export function getCharacterGalleryDir(name: string) {
  return `${getCharacterAssetsDir(name)}/${ECharacterAssets.画廊}`
}
