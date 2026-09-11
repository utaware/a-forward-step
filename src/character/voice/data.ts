import fs from 'fs-extra'

import { jsonStringifyFormat } from '#utils'

import { useRoleVoiceData } from './html'
import { getRoleVoiceDataDir, getRoleVoiceDataPath } from './url'

import type { IRoleVoiceItem } from './html'

// 更新角色语音数据
export async function cacheRoleVoiceData(name: string) {
  const voiceDirPath = getRoleVoiceDataDir(name)
  const voiceDataPath = getRoleVoiceDataPath(name)
  const data = await useRoleVoiceData(name)
  await fs.ensureDir(voiceDirPath)
  await fs.emptyDir(voiceDirPath)
  const cacheData = jsonStringifyFormat(data)
  await fs.outputFile(voiceDataPath, cacheData)
  return data
}

// 确保角色语音数据已缓存
export async function hasRoleVoiceDataCache(name: string) {
  const voiceDataPath = getRoleVoiceDataPath(name)
  return await fs.pathExists(voiceDataPath)
}

// 获取角色语音数据
export async function getRoleVoiceData(name: string): Promise<IRoleVoiceItem[]> {
  const hasCache = await hasRoleVoiceDataCache(name)
  if (hasCache) {
    const voiceDataPath = getRoleVoiceDataPath(name)
    return await fs.readJson(voiceDataPath)
  } else {
    return await cacheRoleVoiceData(name)
  }
}
