import { join, parse } from 'path'

import { ensureDir } from 'fs-extra'

import { impitDownloadFile, print } from '#utils'

import { getRoleGalleryData } from './data'
import { getCharacterGalleryDir } from './url'

/**
 * 净化文件名中的非法字符
 */
function sanitizeFilename(filename: string): string {
  return filename.replace(/[\\/:*?"<>|]/g, '_')
}

// 下载角色画廊数据并保存到本地
export async function downloadRoleGalleryData(name: string) {
  const galleryData = await getRoleGalleryData(name)

  await Promise.all(
    galleryData.map(async item => {
      const { downloadUrl, category, subCategory, title } = item
      if (downloadUrl) {
        try {
          const { ext } = parse(downloadUrl)
          const baseSaveDir = getCharacterGalleryDir(name)
          const realPath = subCategory ? join(baseSaveDir, category, subCategory) : join(baseSaveDir, category)

          const fileExt = ext || '.png'
          const safeTitle = sanitizeFilename(title)
          const filename = `${safeTitle}${fileExt}`
          const filePath = join(realPath, filename)

          await ensureDir(realPath)
          await impitDownloadFile(downloadUrl, filePath)
        } catch (error) {
          print(`Failed to download ${title}: ${(error as Error).message}`, 'error')
        }
      }
    })
  )

  print(`Finished downloading gallery data for ${name}`, 'success')
}
