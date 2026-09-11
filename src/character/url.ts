import { wikiBaseUrl, dataDirPath } from '#config'

// 获取角色在维基百科上的页面 URL
export function getWikiRoleUrl(name: string) {
  return `${wikiBaseUrl}/${name}`
}

// 获取角色在维基百科上的语音页面 URL
export function getRoleVoiceUrl(name: string) {
  return `${getWikiRoleUrl(name)}/语音`
}

// 获取角色在维基百科上的画廊页面 URL
export function getRoleGalleryUrl(name: string) {
  return `${getWikiRoleUrl(name)}/画廊`
}

// 获取角色语音数据的本地存储目录
export function getRoleVoiceDataDir(name: string) {
  return `${dataDirPath}/${name}`
}

// 获取角色语音数据的本地存储路径
export function getRoleVoiceDataPath(name: string) {
  return `${getRoleVoiceDataDir(name)}/voice.json`
}
