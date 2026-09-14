import { join, parse } from 'path'

import { ensureDir } from 'fs-extra'

import { impitDownloadFile, print, sanitizeWindowsFilename } from '#utils'

import { getRoleVoiceData } from './data'
import { getCharacterVoiceDir } from './url'

import type { IRoleVoiceItem } from './html'

// 下载单个语音文件并保存到本地
export async function downloadVoiceWithUrl(name: string, item: IRoleVoiceItem) {
  const { downloadUrl, language, description } = item
  if (!downloadUrl) return

  try {
    const { ext } = parse(downloadUrl)
    const saveDir = getCharacterVoiceDir(name)
    const realPath = join(saveDir, sanitizeWindowsFilename(language))
    const filename = `${sanitizeWindowsFilename(description)}${ext}`
    const filePath = join(realPath, filename)

    await ensureDir(realPath)
    await impitDownloadFile(downloadUrl, filePath)
  } catch (error) {
    print(`Failed to download ${description}: ${(error as Error).message}`, 'error')
  }
}

// 下载角色语音数据并保存到本地
export async function downloadRoleVoiceData(name: string) {
  const voiceData = await getRoleVoiceData(name)

  for await (const item of voiceData) {
    await downloadVoiceWithUrl(name, item)
  }

  print(`Finished downloading voice data for ${name}`, 'success')
}
