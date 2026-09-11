import { wikiBaseUrl, assetsDirPath } from '#config'

export enum ECharacterAssets {
  '语音' = 'voice',
  '画廊' = 'gallery',
  'voice' = '语音',
  'gallery' = '画廊',
}

// 获取角色在维基百科上的页面 URL
export function getWikiRoleUrl(name: string) {
  return `${wikiBaseUrl}/${name}`
}

// 获取角色资源的本地存储目录
export function getCharacterAssetsDir(name: string) {
  return `${assetsDirPath}/character/${name}`
}
