import { dataDirPath } from '#config'

import { ECharacterAssets, getWikiRoleUrl, getCharacterAssetsDir } from '../url'

// 获取角色在维基百科上的语音页面 URL
export function getRoleVoiceUrl(name: string) {
  return `${getWikiRoleUrl(name)}/${ECharacterAssets['voice']}`
}

// 获取角色语音数据的本地存储目录
export function getRoleVoiceDataDir(name: string) {
  return `${dataDirPath}/${name}`
}

// 获取角色语音数据的本地存储路径
export function getRoleVoiceDataPath(name: string) {
  return `${getRoleVoiceDataDir(name)}/${ECharacterAssets.语音}.json`
}

// 获取角色语音资源的本地存储路径
export function getCharacterVoiceDir(name: string) {
  return `${getCharacterAssetsDir(name)}/${ECharacterAssets.语音}`
}
