import { parse } from 'path'

import download from 'download'

import { print } from '#utils'

import { getRoleVoiceData } from './data'
import { getCharacterVoiceDir } from './url'

// 下载角色语音数据并保存到本地
export async function downloadRoleVoiceData(name: string) {
  const voiceData = await getRoleVoiceData(name)

  await Promise.all(
    voiceData.map(async item => {
      const { downloadUrl, language, description } = item
      if (downloadUrl) {
        const { ext } = parse(downloadUrl)
        const saveDir = getCharacterVoiceDir(name)
        const realPath = `${saveDir}/${language}`
        const filename = `${description}${ext}`
        await download(downloadUrl, realPath, { filename })
      }
    })
  )

  print(`Finished downloading voice data for ${name}`, 'success')
}
