import { join, parse } from 'path'

import { ensureDir, writeFile } from 'fs-extra'
import { Impit } from 'impit'

import { print } from '#utils'

import { getRoleVoiceData } from './data'
import { getCharacterVoiceDir } from './url'

// 下载角色语音数据并保存到本地
export async function downloadRoleVoiceData(name: string) {
  const voiceData = await getRoleVoiceData(name)
  const client = new Impit({ browser: 'chrome' })

  await Promise.all(
    voiceData.map(async item => {
      const { downloadUrl, language, description } = item
      if (downloadUrl) {
        try {
          const { ext } = parse(downloadUrl)
          const saveDir = getCharacterVoiceDir(name)
          const realPath = `${saveDir}/${language}`
          const filename = `${description}${ext}`
          const filePath = join(realPath, filename)

          await ensureDir(realPath)
          const response = await client.fetch(downloadUrl)
          if (!response.ok) {
            throw new Error(`HTTP ${response.status} ${response.statusText}`)
          }
          const arrayBuffer = await response.arrayBuffer()
          await writeFile(filePath, Buffer.from(arrayBuffer))
        } catch (error) {
          print(`Failed to download ${description}: ${(error as Error).message}`, 'error')
        }
      }
    })
  )

  print(`Finished downloading voice data for ${name}`, 'success')
}
