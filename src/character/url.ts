import { wikiBaseUrl, dataDirPath, assetsDirPath } from '#config'

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

// 获取角色在维基百科上的语音页面 URL
export function getRoleVoiceUrl(name: string) {
  return `${getWikiRoleUrl(name)}/${ECharacterAssets['voice']}`
}

// 获取角色在维基百科上的画廊页面 URL
export function getRoleGalleryUrl(name: string) {
  return `${getWikiRoleUrl(name)}/${ECharacterAssets['gallery']}`
}

// 获取角色语音数据的本地存储目录
export function getRoleVoiceDataDir(name: string) {
  return `${dataDirPath}/${name}`
}

// 获取角色语音数据的本地存储路径
export function getRoleVoiceDataPath(name: string) {
  return `${getRoleVoiceDataDir(name)}/${ECharacterAssets.语音}}.json`
}

// 获取角色资源的本地存储目录
export function getCharacterAssetsDir(name: string) {
  return `${assetsDirPath}/character/${name}`
}

// 获取角色语音资源的本地存储路径
export function getCharacterVoiceDir(name: string) {
  return `${getCharacterAssetsDir(name)}/${ECharacterAssets.语音}`
}
